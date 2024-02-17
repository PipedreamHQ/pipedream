const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

module.exports = withNextra({
  basePath: "/docs",
  env: {
    PIPEDREAM_NODE_VERSION: "20",
  },
});
