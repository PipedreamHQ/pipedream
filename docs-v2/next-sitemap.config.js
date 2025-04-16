/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://pipedream.com/docs",
  generateRobotsTxt: true,
  outDir: "./public",
  generateIndexSitemap: false,
  // Add a trailing slash to all URLs
  trailingSlash: true,
  // Exclude URLs matching these patterns
  exclude: [
    "/hidden/*",
    "/deprecated/*",
    "/api-docs-server",
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://pipedream.com/sitemap.xml", // If you have a main site sitemap, include it here
    ],
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
