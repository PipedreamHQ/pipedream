/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://pipedream.com/docs",
  generateRobotsTxt: true,
  outDir: "public",
  changefreq: "daily",
  priority: 0.7,
  generateIndexSitemap: false,
  exclude: [
    "/hidden/*",
    "/deprecated/*",
  ],
  transform: async (config, path) => {
    // Add any custom transformations for URL paths here if needed in the future
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod
        ? new Date().toISOString()
        : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
