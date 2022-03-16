const navConfig = require("./navConfig");
const sidebarConfig = require("./sidebarConfig");
const envVars = require('./envVars');

module.exports = {
  algolia: {
    appId: 'XY28M447C5',
    apiKey: "9d9169458128b3d60c22bb04da4431c7",
    indexName: "pipedream",
    algoliaOptions: {
      facetFilters: ['version:latest']
    }
  },
  searchPlaceholder: "Search...",
  logo: "/pipedream.svg",
  repo: "PipedreamHQ/pipedream",
  nav: navConfig,

  // if your docs are not at the root of the repo:
  docsDir: "docs/docs",
  editLinks: true,
  // custom text for edit link. Defaults to "Edit this page"
  editLinkText: "Improve this page",
  sidebar: sidebarConfig,
  ...envVars,
};
