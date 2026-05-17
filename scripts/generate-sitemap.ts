// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://recoveryandwealth.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().slice(0, 10);

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
  { path: "/about", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/pricing", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/coaching", changefreq: "monthly", priority: "0.8", lastmod: today },
  { path: "/tools", changefreq: "weekly", priority: "0.9", lastmod: today },
  { path: "/sobriety-calculator", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/recovery-tools", changefreq: "monthly", priority: "0.8", lastmod: today },
  { path: "/learn", changefreq: "weekly", priority: "0.9", lastmod: today },
  { path: "/learning-path-quiz", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/course-demo", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/course-content", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/halt-lessons", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/advanced-lessons", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/success-stories", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/terms", changefreq: "yearly", priority: "0.3", lastmod: today },
  { path: "/privacy", changefreq: "yearly", priority: "0.3", lastmod: today },
];

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);