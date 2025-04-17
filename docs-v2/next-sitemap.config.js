/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://pipedream.com",
  generateRobotsTxt: true,
  basePath: "/docs",
  outDir: "public",
  changefreq: "daily",
  priority: 0.7,
  exclude: [
    "/hidden/*",
    "/deprecated/*",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
