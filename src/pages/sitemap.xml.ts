import type { APIRoute } from "astro";

const siteUrl = "https://codivex.com";
const pages = [
  "",
  "/services/shopify-development",
  "/services/headless-commerce",
  "/services/nextjs-astro-web-apps",
  "/services/wix-studio-design",
  "/services/wordpress-block-themes",
];

export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((path) => {
      const url = `${siteUrl}${path}`;
      return `  <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>${path === "" ? "1.0" : "0.8"}</priority></url>`;
    })
    .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
