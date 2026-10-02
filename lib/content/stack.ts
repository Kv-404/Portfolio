export type StackCategory = {
  id: string
  category: string
  /**
   * `icon` is a simple-icons slug, or one of the generic keys the Stack
   * component maps to a neutral mark for things that have no brand.
   *
   * `href` is kept as a reference but is deliberately not rendered - the
   * chips are buttons that go nowhere. Switch them back to links and it
   * is already here.
   */
  skills: { title: string; href: string; icon: string }[]
}

export const stack: StackCategory[] = [
  {
    id: "01",
    category: "Languages",
    skills: [
      { title: "Java", href: "https://openjdk.org/", icon: "openjdk" },
      { title: "Python", href: "https://www.python.org/", icon: "python" },
      {
        title: "TypeScript",
        href: "https://www.typescriptlang.org/",
        icon: "typescript",
      },
      {
        title: "JavaScript",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        icon: "javascript",
      },
      { title: "C", href: "https://en.cppreference.com/w/c", icon: "c" },
      { title: "C++", href: "https://isocpp.org/", icon: "cplusplus" },
      { title: "Rust", href: "https://www.rust-lang.org/", icon: "rust" },
      {
        title: "SQL",
        href: "https://en.wikipedia.org/wiki/SQL",
        icon: "generic-sql",
      },
    ],
  },
  {
    id: "02",
    category: "Web",
    skills: [
      { title: "React", href: "https://react.dev/", icon: "react" },
      { title: "Node.js", href: "https://nodejs.org/", icon: "nodedotjs" },
      { title: "Vite", href: "https://vite.dev/", icon: "vite" },
      {
        title: "Tailwind CSS",
        href: "https://tailwindcss.com/",
        icon: "tailwindcss",
      },
      { title: "Three.js", href: "https://threejs.org/", icon: "threedotjs" },
      {
        title: "HTML",
        href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
        icon: "html5",
      },
      {
        title: "CSS",
        href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
        icon: "css",
      },
    ],
  },
  {
    id: "03",
    category: "Security & networking",
    skills: [
      {
        title: "Wireshark",
        href: "https://www.wireshark.org/",
        icon: "wireshark",
      },
      { title: "Linux", href: "https://www.kernel.org/", icon: "linux" },
      {
        title: "TCP/IP",
        href: "https://en.wikipedia.org/wiki/Internet_protocol_suite",
        icon: "generic-api",
      },
      {
        title: "DNS",
        href: "https://en.wikipedia.org/wiki/Domain_Name_System",
        icon: "generic-api",
      },
      {
        title: "Cryptography",
        href: "https://en.wikipedia.org/wiki/Cryptography",
        icon: "generic-editor",
      },
    ],
  },
  {
    id: "04",
    category: "Tools",
    skills: [
      { title: "Git", href: "https://git-scm.com/", icon: "git" },
      { title: "GitHub", href: "https://github.com/", icon: "github" },
      { title: "Bash", href: "https://www.gnu.org/software/bash/", icon: "gnubash" },
      { title: "npm", href: "https://www.npmjs.com/", icon: "npm" },
      { title: "MongoDB", href: "https://www.mongodb.com/", icon: "mongodb" },
      { title: "Firebase", href: "https://firebase.google.com/", icon: "firebase" },
      { title: "Supabase", href: "https://supabase.com/", icon: "supabase" },
    ],
  },
]
