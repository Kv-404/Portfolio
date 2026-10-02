import { NextResponse } from "next/server"

const GITHUB_API = "https://api.github.com/graphql"
const PUBLIC_API = "https://github-contributions-api.jogruber.de/v4"
const DEFAULT_USER = "Kv-404"

type Day = {
  date: string
  contributionCount: number
  contributionLevel: number
}

const cacheHeaders = {
  // 5 minutes at the CDN; browsers revalidate so a reload stays current.
  "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
}

/**
 * Public contribution calendar. No token, same trailing year GitHub shows
 * on the profile, so the graph renders for a visitor with nothing configured.
 */
async function fromPublic(login: string) {
  const res = await fetch(`${PUBLIC_API}/${encodeURIComponent(login)}?y=last`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  })
  if (!res.ok) return null

  const json = (await res.json()) as {
    total?: { lastYear?: number }
    contributions?: { date: string; count: number; level: number }[]
  }
  const contributions = json.contributions
  if (!contributions?.length) return null

  const days: Day[] = contributions.map((day) => ({
    date: day.date,
    contributionCount: day.count,
    contributionLevel: day.level,
  }))

  return {
    totalContributions:
      json.total?.lastYear ??
      days.reduce((sum, day) => sum + day.contributionCount, 0),
    days,
  }
}

async function fromGraphQL(login: string, token: string) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch(GITHUB_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { login } }),
    cache: "no-store",
  })
  if (!res.ok) return null

  const json = await res.json()
  const calendar =
    json?.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar?.weeks) return null

  const levelByQuartile: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  }

  const days: Day[] = calendar.weeks.flatMap(
    (week: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        contributionCount: day.contributionCount,
        contributionLevel: levelByQuartile[day.contributionLevel] ?? 0,
      }))
  )

  return {
    totalContributions: calendar.totalContributions as number,
    days,
  }
}

export async function GET() {
  const token =
    process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN
  const login = process.env.GITHUB_USERNAME || DEFAULT_USER

  const data =
    (await fromPublic(login)) ??
    (token ? await fromGraphQL(login, token) : null)

  if (!data) {
    return NextResponse.json({ unavailable: true })
  }

  return NextResponse.json(data, { headers: cacheHeaders })
}
