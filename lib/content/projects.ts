export type ProjectImage = {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
  /** Tall phone captures are framed narrower in the gallery. */
  device?: "desktop" | "mobile"
}

export type ProjectStep = { title: string; body: string }

/** One column in the "how it works" diagram; several nodes stack. */
export type DiagramStage = {
  nodes: { title: string; detail?: string; tag?: string; emphasis?: boolean }[]
}

export type ProjectStat = { value: string; label: string }

export type Project = {
  slug: string
  title: string
  subheading?: string
  description: string
  image: string
  /** Optional clip played on hover, with `image` as the poster frame. */
  video?: string
  links: { website?: string; github?: string }
  technologies: string[]
  status: "live" | "building" | "source"
  /** Human label shown on cards and the detail page. */
  statusLabel: string
  year: string
  role: string
  /** Everything below powers /projects/[slug]. */
  cover: ProjectImage
  overview: string[]
  problem: string[]
  howItWorks: {
    intro?: string
    diagram?: { caption: string; stages: DiagramStage[] }
    steps: ProjectStep[]
  }
  features: { title: string; body: string }[]
  stack: { group: string; items: string[] }[]
  results: { stats: ProjectStat[]; notes?: string[] }
  gallery: ProjectImage[]
  learnings: string[]
}

/**
 * Order matters: the home page shows the first two, and the projects
 * page lists all of them.
 */
export const projects: Project[] = [
  {
    slug: "aayam",
    title: "Aayam",
    subheading: "A live college timetable that changes when the sheet does",
    description:
      "A live timetable that reads the college’s Google Sheets and shows today, the week and every change for one section or one teacher, with Google sign-in for faculty and a calendar feed for everyone.",
    image: "/projects/aayam/week.jpg",
    links: {
      website: "https://aayam.kv404.dev",
      github: "https://github.com/Kv-404/Aayam",
    },
    technologies: ["React", "TypeScript", "Cloudflare Workers", "D1", "GitHub Actions"],
    status: "live",
    statusLabel: "Live",
    year: "2026",
    role: "Design & engineering",
    cover: {
      src: "/projects/aayam/week.jpg",
      alt: "Aayam week view for one section: a time-by-day grid of colour-coded lectures with teacher and room, a lunch break row, and one class struck through as cancelled",
      width: 2400,
      height: 1500,
    },
    overview: [
      "Aayam (आयाम) is the timetable for the School of FutureTech at ITM / ISU. One public Google Sheet per program and batch is the single source of truth. Aayam reads each sheet’s public Excel export and never writes back.",
      "Students pick their batch, then their section. The week is an interactive grid and a single day is a compact list. Cancelled classes stay on the grid, struck through, and past weeks stay browsable. Faculty sign in with their college Google account and see every lecture they teach, across all batches.",
    ],
    problem: [
      "The real timetable lives in spreadsheets that admins edit through the week. A cancelled class or a moved room is easy to miss, and a teacher who teaches across several batches has to hunt through many tabs to find their own lectures.",
      "Batches publish next week’s sheet on different days, so a naive reader opens on the oldest dates instead of the latest week. A student checking a phone before rushing to campus needs today’s classes, and a cancellation has to stay visible, not quietly vanish.",
      "It also had to run for free. Parsing one sheet with ExcelJS takes 150–400 ms of CPU, while a free Cloudflare Worker allows 10 ms per request.",
    ],
    howItWorks: {
      intro:
        "The heavy work and the serving are split. A scheduled job does all the parsing on GitHub’s runners and stores every response the site can ask for. The Worker only looks up a prebuilt row and answers.",
      diagram: {
        caption: "Sheets to screen: parse once on a runner, serve prebuilt rows from the edge.",
        stages: [
          { nodes: [{ title: "Google Sheets", detail: "public .xlsx export, one per batch" }] },
          {
            nodes: [
              {
                title: "Sync job",
                detail: "GitHub Actions · every 5 min or on demand",
                tag: "parse · diff · archive",
                emphasis: true,
              },
            ],
          },
          {
            nodes: [
              { title: "Cloudflare D1", detail: "archive + past weeks" },
              { title: "Snapshots", detail: "every API response, prebuilt" },
            ],
          },
          {
            nodes: [
              {
                title: "Worker",
                detail: "≤ 10 ms CPU · one lookup · ETag/304",
                emphasis: true,
              },
            ],
          },
          {
            nodes: [
              { title: "Web app", detail: "Day · Week · Updates" },
              { title: ".ics feed", detail: "Google, Apple, Outlook" },
              { title: "MCP", detail: "AI assistants" },
            ],
          },
        ],
      },
      steps: [
        {
          title: "An admin points a batch at its sheet",
          body: "From /admin, an admin pastes the sheet link. The Worker checks the public export really is an Excel file, stores the link and asks for a sync. Next week’s sheet replaces the current one within about a minute, and the old week moves to the past-weeks menu.",
        },
        {
          title: "A job parses the sheets off the edge",
          body: "A GitHub Actions job runs every five minutes, or right away when someone taps Refresh. It downloads each sheet, parses it, detects what changed since the last version, archives older weeks and keeps the latest week live.",
        },
        {
          title: "Every response is prebuilt",
          body: "The same job renders every answer the site can ask for — per section, per teacher, per week, plus the calendar feeds — and writes only the rows whose hash changed. An unchanged run writes about three rows. It also sends any queued web pushes.",
        },
        {
          title: "The Worker just looks up and answers",
          body: "The Cloudflare Worker serves the React app and a thin /api. Each request is one D1 lookup and a little string stitching, with ETag and 304 so repeat visits cost almost nothing.",
        },
        {
          title: "The client stays fresh without hammering",
          body: "The app refetches at most every five minutes while the tab is visible and never while it is hidden. A phone opens on Day, a wide screen and every teacher open on Week.",
        },
      ],
    },
    features: [
      {
        title: "Day, Week and Updates",
        body: "A compact list for today, a time × day grid for the week, and a log of what changed since the last version of the sheet.",
      },
      {
        title: "Cancellations stay visible",
        body: "A cancelled class stays on the grid, struck through and labelled, so students know it was cancelled rather than wondering where it went.",
      },
      {
        title: "Faculty sign-in",
        body: "Google sign-in limited to the college’s domains and checked against a faculty directory. Coordinators open on their cohorts; all-access staff can see every class.",
      },
      {
        title: "Calendar feed",
        body: "Anyone can subscribe to an .ics feed for their section or their teaching week in Google, Apple, Outlook or Proton calendars.",
      },
      {
        title: "Alerts and reminders",
        body: "Opt-in web push for timetable changes and lecture reminders. Admins can also post short notices to a batch.",
      },
      {
        title: "Connect AI",
        body: "A remote MCP server behind OAuth 2.1 with PKCE lets a teacher ask an assistant things like “what do I have tomorrow, and which rooms are free at 2?” — scoped to what they’re allowed to see.",
      },
    ],
    stack: [
      { group: "Frontend", items: ["React 19", "TypeScript", "Vite", "Tailwind CSS v4", "TanStack Query"] },
      { group: "Edge", items: ["Cloudflare Workers", "Cloudflare D1"] },
      { group: "Sync job", items: ["GitHub Actions", "Node 24", "ExcelJS"] },
      { group: "Auth & integrations", items: ["Google OAuth", "HMAC sessions", "Web Push", "iCalendar", "MCP + OAuth 2.1"] },
    ],
    results: {
      stats: [
        { value: "5 min", label: "sync cadence, or on demand" },
        { value: "≤ 10 ms", label: "CPU per API request at the edge" },
        { value: "~0.3 ms", label: "to assemble a ~400 KB bootstrap" },
        { value: "~37 KB", label: "Worker bundle, gzipped" },
        { value: "~1 min", label: "to switch to next week’s sheet" },
        { value: "$0", label: "runs entirely on free tiers" },
      ],
      notes: [
        "Every push to main is typechecked, tested, built, migrated and deployed by CI.",
        "The repository is public and holds no secrets; the browser never receives a Google key.",
      ],
    },
    gallery: [
      {
        src: "/projects/aayam/week.jpg",
        alt: "Week view for one section with colour-coded lectures, teacher names, rooms and a cancelled class struck through",
        caption: "Week view for one section. The Thursday 1 PM class is cancelled but stays on the grid.",
        width: 2400,
        height: 1500,
      },
      {
        src: "/projects/aayam/landing.jpg",
        alt: "Aayam landing page: “The timetable that changes when the sheet does”, beside a mock week grid",
        caption: "The pitch page at /pitch.",
        width: 2400,
        height: 1500,
      },
      {
        src: "/projects/aayam/mobile-day.jpg",
        alt: "Aayam on a phone: today’s lectures as a compact list with times, rooms and a lunch divider",
        caption: "On a phone it opens on today.",
        width: 554,
        height: 1200,
        device: "mobile",
      },
      {
        src: "/projects/aayam/gate.jpg",
        alt: "Aayam home gate asking “I am” with Student and Faculty choices",
        caption: "The home gate: Student or Faculty.",
        width: 2400,
        height: 1500,
      },
      {
        src: "/projects/aayam/audiences.jpg",
        alt: "Pitch page section explaining the student and faculty journeys side by side",
        caption: "One section for a student, one teaching week for a teacher.",
        width: 2400,
        height: 1500,
      },
    ],
    learnings: [
      "Put the work where the CPU is free. Splitting a slow parser from a fast server, and storing the read model ahead of time, made a free Worker plenty.",
      "An earlier version on serverless Postgres kept hitting egress limits because every cold start re-read the whole archive. Prebuilt snapshots that only change when their hash does fixed that at the root, not with more caching.",
      "“Latest” has to be defined, not assumed. Picking the newest Monday across every batch, instead of the earliest date, is what made the default view trustworthy.",
      "Microcopy matters in a utility. “Cancelled · Prof unavailable” beats a status code, and a struck-through class beats a missing one.",
    ],
  },
  {
    slug: "image-to-poem",
    title: "Image to Poem",
    subheading: "A photo in, an eight-line poem out",
    description:
      "Drop in a photo, get a caption, a mood and an eight-line poem in about seven seconds, offline on a laptop. A mood classifier trained from scratch (87.5% accuracy) and a LoRA fine-tune of Qwen2.5-0.5B on 270 hand-built image-to-poem pairs.",
    image: "/projects/image-to-poem/01-studio.jpg",
    links: {
      github: "https://github.com/Kv-404/ImagetoPoem",
    },
    technologies: ["Python", "PyTorch", "scikit-learn", "LoRA", "CLIP", "BLIP"],
    status: "source",
    statusLabel: "Source only",
    year: "2026",
    role: "ML & engineering · college mini-project",
    cover: {
      src: "/projects/image-to-poem/01-studio.jpg",
      alt: "The Studio: a lake photo is dropped in, the app reads it as calm with full confidence, captions it and writes an eight-line poem",
      width: 1600,
      height: 1000,
    },
    overview: [
      "Image to Poem takes a photo and returns a caption, a mood and an eight-line poem in about seven seconds, offline on a laptop CPU. It started as a college machine-learning mini-project with one rule: train at least one model myself, and be honest about which parts are pretrained.",
      "It ships with a one-page site that is both the demo and the write-up: a Studio to drop a photo into, every model in pipeline order, and the charts behind every number. It is not hosted — it runs locally from the source.",
    ],
    problem: [
      "Big multimodal models can write a poem about a photo, but that teaches you nothing and needs a server. I wanted the whole thing to fit on a laptop, run offline, and contain parts I actually built and could explain in a viva.",
      "Two gaps stood out. Nothing off the shelf gave a reliable mood for a photo, and a small 0.5 B language model wrote poems in no consistent shape — only 28% of its poems came out with exactly eight lines.",
    ],
    howItWorks: {
      intro:
        "Two pretrained models look at the photo; everything after that is mine — a classifier trained from scratch, a fine-tuned adapter, and a rule-based scorer.",
      diagram: {
        caption: "Filled boxes are trained or written by me; outlined boxes are pretrained and frozen.",
        stages: [
          { nodes: [{ title: "Photo", detail: "any JPG or PNG" }] },
          {
            nodes: [
              { title: "BLIP base", detail: "caption", tag: "pretrained" },
              { title: "CLIP ViT-B/32", detail: "512 features", tag: "pretrained" },
            ],
          },
          {
            nodes: [
              { title: "Caption", detail: "one line of text" },
              {
                title: "Scaler → PCA → KNN",
                detail: "mood · 4 classes",
                tag: "trained by me",
                emphasis: true,
              },
            ],
          },
          {
            nodes: [
              {
                title: "Qwen2.5-0.5B + LoRA",
                detail: "3 candidate poems",
                tag: "fine-tuned by me",
                emphasis: true,
              },
            ],
          },
          {
            nodes: [
              {
                title: "Poem scorer",
                detail: "picks the best of 3",
                tag: "written by me",
                emphasis: true,
              },
            ],
          },
          { nodes: [{ title: "8-line poem", detail: "~7 s on a laptop CPU" }] },
        ],
      },
      steps: [
        {
          title: "Caption the photo",
          body: "BLIP base (pretrained, frozen) writes a one-line caption in about a second. This is what the poem will be about.",
        },
        {
          title: "Turn the photo into numbers",
          body: "CLIP ViT-B/32 (pretrained, frozen) turns the image into 512 numbers. They are L2-normalised and standardised before anything learns from them.",
        },
        {
          title: "Read the mood — the model I trained from scratch",
          body: "A scikit-learn pipeline: StandardScaler, then PCA from 512 down to 98 components (90% of the variance), then KNN. It was chosen from five models on 5-fold cross-validation, trained on 251 photos I collected and labelled by hand across four moods: happy, sad, calm and energetic.",
        },
        {
          title: "Write three poems — the model I fine-tuned",
          body: "Qwen2.5-0.5B-Instruct with my LoRA adapter (rank 16 on every attention and MLP layer) gets a short prompt with the caption and mood and writes three candidates in one batch. Only 8.8 M of its 503 M weights were trained — 1.75%, in six minutes on a MacBook GPU.",
        },
        {
          title: "Pick the best one",
          body: "A plain-Python scorer rates each candidate on rhyme, caption words, mood words and penalties, and shows the winner. The model is unchanged; this is re-ranking.",
        },
      ],
    },
    features: [
      {
        title: "The Studio",
        body: "Drop an image into the page and get the caption, the mood with its confidence, the poem and a timing breakdown.",
      },
      {
        title: "Fully offline",
        body: "After a one-time ~2.5 GB model download, everything runs with the network off on a laptop CPU.",
      },
      {
        title: "Home-made training data",
        body: "The base model wrote eight candidate poems per image with a strict “teacher” prompt; my scorer kept the best. That gave 270 training and 19 validation pairs, split by image so nothing leaks.",
      },
      {
        title: "JSON API and Gradio",
        body: "POST a photo to /api/poem for caption, mood, probabilities, poem and timing, or use the classic Gradio UI with a Regenerate button.",
      },
      {
        title: "The write-up is the site",
        body: "Fourteen interactive charts: model comparison, confusion matrix, clustering, training loss, and base-vs-fine-tune side by side.",
      },
      {
        title: "Train it yourself",
        body: "Every step — dataset, features, classifier, poem data, LoRA training, evaluation — is one command, with a Colab notebook for anyone without a GPU.",
      },
    ],
    stack: [
      { group: "Models", items: ["BLIP base", "CLIP ViT-B/32", "Qwen2.5-0.5B-Instruct"] },
      { group: "Training", items: ["PyTorch 2.5", "Transformers", "PEFT (LoRA)", "scikit-learn"] },
      { group: "App", items: ["Python 3.11", "Gradio", "JSON API"] },
      { group: "Analysis", items: ["pandas", "matplotlib", "Jupyter"] },
    ],
    results: {
      stats: [
        { value: "87.5%", label: "mood accuracy, KNN, 5-fold CV (± 5.2%)" },
        { value: "251", label: "hand-labelled photos, 4 moods" },
        { value: "28% → 99%", label: "poems with exactly 8 lines, base → fine-tune" },
        { value: "8.8 M / 503 M", label: "weights trained by LoRA (1.75%)" },
        { value: "6 min", label: "LoRA training on a MacBook GPU" },
        { value: "~7 s", label: "per photo, offline on a laptop CPU" },
      ],
      notes: [
        "The fine-tune learned the format — two verses, exactly eight lines, 42% faster output. It did not learn rhyme: only 8% of the training poems rhymed.",
        "Validation loss bottomed out around the first epoch (2.13 → 1.89) and then rose while training loss kept falling. 270 pairs is a small dataset.",
        "K-Means on the same features does not find the moods by itself (silhouette 0.05, ARI 0.28), which is why the labels were needed.",
      ],
    },
    gallery: [
      {
        src: "/projects/image-to-poem/01-studio.jpg",
        alt: "The Studio with a lake photo, its caption, the calm mood and an eight-line poem",
        caption: "The Studio: drop a photo, get a caption, a mood and a poem.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/image-to-poem/02-models.jpg",
        alt: "Six model cards in pipeline order: BLIP, CLIP, mood classifier, Qwen, LoRA adapter, poem scorer",
        caption: "The six parts, in pipeline order, each marked pretrained or mine.",
        width: 1600,
        height: 1555,
      },
      {
        src: "/projects/image-to-poem/03-mood.jpg",
        alt: "Five classifier cards, an accuracy dot plot and a confusion matrix",
        caption: "Five mood classifiers compared on the same folds. KNN wins on CV.",
        width: 1600,
        height: 1822,
      },
      {
        src: "/projects/image-to-poem/05-poem-training.jpg",
        alt: "Five training steps, the poem score distribution and train versus validation loss",
        caption: "How the poem data was built and how training went.",
        width: 1600,
        height: 1317,
      },
      {
        src: "/projects/image-to-poem/06-poem-eval.jpg",
        alt: "Base versus fine-tuned comparison: verdict cards, bar chart, line-count histogram and side-by-side poems",
        caption: "Base vs fine-tune: the format improved, rhyme did not.",
        width: 1600,
        height: 1666,
      },
      {
        src: "/projects/image-to-poem/07-samples.jpg",
        alt: "Four sample photos, one per mood, each with its caption and poem",
        caption: "One sample per mood.",
        width: 1600,
        height: 1167,
      },
      {
        src: "/projects/image-to-poem/04-clustering.jpg",
        alt: "K-Means elbow plot, silhouette scores and a 2-D map of the CLIP features",
        caption: "Unsupervised check: the moods are not natural clusters.",
        width: 1600,
        height: 1222,
      },
      {
        src: "/projects/image-to-poem/08-dataset.jpg",
        alt: "Dataset section with counts per mood and a grid of photos",
        caption: "251 Creative Commons photos from Openverse.",
        width: 1600,
        height: 1227,
      },
      {
        src: "/projects/image-to-poem/10-phone.jpg",
        alt: "The Studio at phone width",
        caption: "It works on a phone too.",
        width: 1170,
        height: 2532,
        device: "mobile",
      },
      {
        src: "/projects/image-to-poem/09-viva.jpg",
        alt: "Viva questions and answers, syllabus map, limits and glossary tabs",
        caption: "Viva Q&A, syllabus map and limits, built into the site.",
        width: 1600,
        height: 1111,
      },
    ],
    learnings: [
      "A model can only be as good as its data. The fine-tune nailed the eight-line shape because every target had it, and ignored rhyme because almost none did. The next step is rebuilding the data from rhyming candidates only.",
      "Pick models by cross-validation, not the test set. On 51 test images one photo moves the score by two points; the test set stays an honest final check.",
      "Fit the scaler and PCA inside each fold, and split poems by image, or the numbers quietly leak and lie.",
      "Fine-tuning is not training from scratch, and saying so plainly makes the work more credible, not less. LoRA on 1.75% of the weights was enough to change behaviour in six minutes.",
    ],
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
