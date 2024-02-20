import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

import PipedreamCode from "./components/PipedreamCode";
import PipedreamLink from "./components/PipedreamLink";
import PipedreamTextLogo from "./components/PipedreamTextLogo";
import SlackLogo from "./components/SlackLogo";

const config: DocsThemeConfig = {
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Pipedream Documentation" />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
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
  docsRepositoryBase: "https://github.com/PipedreamHQ/pipedream/docs",
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
};

export default config;
