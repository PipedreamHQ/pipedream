const navConfig = require("./navConfig");
const sidebarConfig = require("./sidebarConfig");
const envVars = require("./envVars");

module.exports = {
  algolia: {
    appId: "XY28M447C5",
    apiKey: "9d9169458128b3d60c22bb04da4431c7",
    indexName: "pipedream",
    algoliaOptions: {
      facetFilters: ["version:latest"],
    },
  },
  searchPlaceholder: "Search...",
  logo: "https://res.cloudinary.com/pipedreamin/image/upload/t_logo48x48/v1597038956/docs/HzP2Yhq8_400x400_1_sqhs70.jpg",
  repo: "PipedreamHQ/pipedream",
  nav: navConfig,

  // if your docs are not at the root of the repo:
  docsDir: "docs/docs",
  editLinks: true,
  // custom text for edit link. Defaults to "Edit this page"
  editLinkText: "Improve this page",
  sidebarDepth: 3,
  sidebar: sidebarConfig,
  // languages
  icons: {
    nodejs: {
      only_icon:
        "https://res.cloudinary.com/pipedreamin/image/upload/v1646761316/docs/icons/icons8-nodejs_aax6wn.svg",
      with_title:
        "https://res.cloudinary.com/pipedreamin/image/upload/v1646761316/docs/icons/icons8-nodejs_aax6wn.svg",
    },
    python: {
      only_icon:
        "https://res.cloudinary.com/pipedreamin/image/upload/v1646763734/docs/icons/icons8-python_ypgmya.svg",
      with_title:
        "https://res.cloudinary.com/pipedreamin/image/upload/v1647356607/docs/icons/python-logo-generic_k3o5w2.svg",
    },
    go: {
      only_icon:
        "https://res.cloudinary.com/pipedreamin/image/upload/v1646763751/docs/icons/Go-Logo_Blue_zhkchv.svg",
      with_title:
        "https://res.cloudinary.com/pipedreamin/image/upload/v1646763751/docs/icons/Go-Logo_Blue_zhkchv.svg",
    },
    bash: {
      only_icon:
        "https://res.cloudinary.com/pipedreamin/image/upload/v1646763756/docs/icons/full_colored_dark_nllzkl.svg",
      with_title:
        "https://res.cloudinary.com/pipedreamin/image/upload/v1647356698/docs/icons/full_colored_dark_1_-svg_vyfnv7.svg",
    },
    native: {
      only_icon: "https://res.cloudinary.com/pipedreamin/image/upload/v1569526159/icons/pipedream_x6plab.svg",
      with_title: "https://res.cloudinary.com/pipedreamin/image/upload/v1569526159/icons/pipedream_x6plab.svg"
    }
  },
  // environment variables
  ...envVars,
};
