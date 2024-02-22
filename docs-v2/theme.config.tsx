import React from "react";
import { useRouter } from "next/router";
import { DocsThemeConfig } from "nextra-theme-docs";

import PipedreamCode from "./components/PipedreamCode";
import PipedreamLink from "./components/PipedreamLink";
import PipedreamTextLogo from "./components/PipedreamTextLogo";
import SlackLogo from "./components/SlackLogo";
import DocSearch from "./components/DocSearch";

const config: DocsThemeConfig = {
  head: null,
  components: {
    "a": PipedreamLink,
    "code": PipedreamCode,
  },
  logo: PipedreamTextLogo,
  logoLink: "https://pipedream.com",
  project: {
    link: "https://github.com/PipedreamHQ/pipedream",
  },
  chat: {
    link: "https://pipedream.com/support",
    icon: SlackLogo,
  },
  docsRepositoryBase: "https://github.com/PipedreamHQ/pipedream/docs-v2",
  footer: {
    text: (
      <span>
        Pipedream, Inc. {new Date().getFullYear()} {" "}
      </span>
    ),
  },
  primaryHue: 153,
  primarySaturation: 100,
  feedback: {
    content: null,
  },
  sidebar: {
    autoCollapse: true,
    defaultMenuCollapseLevel: 1,
  },
  nextThemes: {
    defaultTheme: "dark",
  },
  useNextSeoProps() {
    const { route } = useRouter();
    return {
      titleTemplate: "%s - Pipedream",
      description: "Workflow automation for developers",
      canonical: `https://pipedream.com/docs${route}`,
      additionalLinkTags: [
        {
          href: "/docs/favicon.ico",
          rel: "icon",
        },
      ],
    };
  },
  search: {
    component: DocSearch,
    // component: Docsearch,
  },
};

export default config;
