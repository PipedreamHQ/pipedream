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
  // Custom components that replace the default MDX components
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
  docsRepositoryBase: "https://github.com/PipedreamHQ/pipedream/blob/master/docs-v2",
  footer: {
    text: (
      <span>
        Pipedream, Inc. {new Date().getFullYear()} {" "}
      </span>
    ),
  },
  primaryHue: 153, // Pipedream green
  primarySaturation: 100,
  feedback: {
    content: null,  // By default this showed a Discord support icon, this was the recommended way to disable it
  },
  sidebar: {
    autoCollapse: true,
    defaultMenuCollapseLevel: 1,
  },
  useNextSeoProps() {
    const { route } = useRouter();
    return {
      titleTemplate: "%s - Pipedream",
      description: "Workflow automation for developers",
      canonical: `https://pipedream.com/docs${ route === '/' ? '' : route}`,
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
  },
};

export default config;
