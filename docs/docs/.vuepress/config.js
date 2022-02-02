const path = require("path");
const webpack = require("webpack");

module.exports = {
  title: "",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["link", { rel: "stylesheet", href: "/dist/tailwind.css" }],
  ],
  description: "Pipedream Documentation - Connect APIs, remarkably fast",
  base: "/docs-v2/",
  plugins: [
    // [
    // "vuepress-plugin-canonical",
    // {
    // baseURL: "https://pipedream.com/docs", // base url for your canonical link, optional, default: ''
    // stripExtension: true,
    // },
    // ],

    "@vuepress/register-components",
    {
      components: {
        workflow: path.resolve(
          __dirname,
          "./theme/components/svgs/workflow.vue"
        ),
      },
      componentsDir: path.resolve(__dirname, "./theme/components"),
    },
  ],
  clientAppEnhanceFiles: path.resolve(__dirname, "clientAppEnhance.js"),

  theme: path.resolve(__dirname, "./theme/index.ts"),
  themeConfig: {
    algolia: {
      apiKey: "1e23962724b59d018bdedc0f5a214ce5",
      indexName: "pipedream-v2",
    },
    searchPlaceholder: "Search...",
    logo: "/pipedream.svg",
    repo: "PipedreamHQ/pipedream",
    navbar: [
      {
        text: "Get Started",
        link: "/quickstart/README.md",
      },
      {
        text: "Concepts",
        grid: [
          {
            title: "Workflows",
            subtitle: "Automate series of actions",
            link: "/workflows/",
            icon: "workflow-icon",
          },
          {
            title: "Steps",
            subtitle: "Perform pre-coded actions",
            link: "/workflows/steps",
            icon: "step-icon",
          },
          {
            title: "Triggers",
            subtitle: "Control when workflows run",
            link: "/workflows/triggers",
            icon: "trigger-icon",
          },
          {
            title: "Code",
            subtitle: "Run code in workflow steps",
            link: "/code/",
            icon: "code-icon",
          },
          {
            title: "Integrate",
            subtitle: "Connect apps together",
            link: "/apps/",
            icon: "integration-icon",
          },
        ],
      },
    ],
    nav: [
      {
        text: "v2",
        className: "docs-version",
        ariaLabel: "Docs Version Menu",
        items: [
          {
            text: "v2",
            link: "https://pipedream.com/docs-v2",
            internal: true,
            badge: "New",
            badgeVariation: "primary",
          },
          {
            text: "v1",
            internal: true,
            link: "https://pipedream.com/docs",
          },
        ],
      },
    ],

    // if your docs are not at the root of the repo:
    docsDir: "docs/docs",
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: "Help us improve this page! Submit an edit on Github",
    sidebar: {
      "/quickstart/": [
        {
          text: "Get Started",
          children: [
            // "/workflows/README.md",
            "/quickstart/hello-world/README.md",
            // "/workflows/steps/triggers/README.md",
            // "/workflows/events/README.md",
            // "/components/actions/README.md",
            // "/workflows/concurrency-and-throttling/",
            // "/environment-variables/",
            // "/workflows/settings/",
            // "/workflows/networking/",
          ],
        },
      ],
      //   "/sources/",
      //   "/connected-accounts/",
      //   "/user-settings/",
      //   {
      //     title: "Organizations",
      //     children: ["/orgs/", "/orgs/sso/okta/"],
      //   },
      //   {
      //     title: "Reference: Code, APIs + CLI",
      //     children: [
      //       {
      //         title: "Writing Code in Workflows",
      //         type: "group",
      //         initialOpenGroupIndex: 1,
      //         children: [
      //           "/code/",
      //           {
      //             title: "Node.js",
      //             type: "group",
      //             children: [
      //               "/code/nodejs/",
      //               "/code/nodejs/auth/",
      //               "/code/nodejs/http-requests/",
      //               "/code/nodejs/working-with-files/",
      //               "/code/nodejs/async/",
      //             ],
      //           },
      //           "/code/python/",
      //           "/code/go/",
      //           "/code/bash/",
      //           "/destinations/",
      //         ],
      //       },
      //       {
      //         title: "Authoring Components",
      //         type: "group",
      //         children: [
      //           "/components/",
      //           "/components/quickstart/nodejs/actions/",
      //           "/components/quickstart/nodejs/sources/",
      //           "/components/api/",
      //           "/components/guidelines/",
      //           "/pipedream-axios/",
      //         ],
      //       },
      //       {
      //         title: "CLI",
      //         type: "group",
      //         children: ["/cli/install/", "/cli/login/", "/cli/reference/"],
      //       },
      //       {
      //         title: "APIs",
      //         type: "group",
      //         children: [
      //           "/api/overview/",
      //           "/api/auth/",
      //           "/api/rest/",
      //           "/api/rest/webhooks/",
      //           "/api/rest/rss/",
      //           "/api/rest/workflow-errors/",
      //           "/api/sse/",
      //         ],
      //       },
      //       {
      //         title: "Integrations",
      //         type: "group",
      //         children: [
      //           "/apps/all-apps/",
      //           "/apps/discord/",
      //           "/apps/hubspot/",
      //           "/apps/servicenow/",
      //           "/apps/slack/",
      //           "/apps/strava/",
      //           "/apps/twitter/",
      //           "/apps/zoom/",
      //         ],
      //       },
      //     ],
      //   },
      //   "/troubleshooting/",
      //   {
      //     title: "Privacy & Security",
      //     children: [
      //       "/privacy-and-security/",
      //       "/privacy-and-security/best-practices/",
      //       "/abuse/",
      //       "/privacy-and-security/pgp-key/",
      //       "/subprocessors/",
      //     ],
      //   },
      //   {
      //     title: "Pricing & Limits",
      //     collapsable: true,
      //     children: ["/limits/", "/pricing/", "/workflows/events/cold-starts/"],
      //   },
      //   "/status/",
      //   ["https://pipedream.com/support", "Need more help?"],
      // ]
    },
    bundler: "@vuepress/vite",
    bundlerConfig: {
      viteOptions: {
        css: {
          postcss: {
            plugins: [require("tailwindcss"), require("autoprefixer")],
          },
        },
      },
    },
    PIPEDREAM_BASE_URL: "https://pipedream.com",
    API_BASE_URL: "https://api.pipedream.com/v1",
    SQL_API_BASE_URL: "https://rt.pipedream.com/sql",
    PAYLOAD_SIZE_LIMIT: "512KB",
    MEMORY_LIMIT: "256MB",
    MEMORY_ABSOLUTE_LIMIT: "10GB",
    EMAIL_PAYLOAD_SIZE_LIMIT: "30MB",
    INSPECTOR_EVENT_LIMIT: "100",
    FUNCTION_PAYLOAD_LIMIT: "6MB",
    INSPECTOR_EVENT_EXPIRY_DAYS: "30",
    DAILY_INVOCATIONS_LIMIT: "333",
    FREE_ORG_DAILY_INVOCATIONS_LIMIT: "66",
    PRICE_PER_INVOCATION: "0.0002",
    FREE_MONTHLY_INVOCATIONS: "10,000",
    PRO_MONTHLY_INVOCATIONS: "20,000",
    TEAM_MONTHLY_INVOCATIONS: "20,000",
    ENTERPRISE_MONTHLY_INVOCATIONS: "100,000",
    TEAM_MEMBER_LIMIT: "5",
    PRO_MONTHLY_PRICE: "$19",
    TEAM_MONTHLY_PRICE: "$19",
    DEFAULT_WORKFLOW_QUEUE_SIZE: "100",
    MAX_WORKFLOW_QUEUE_SIZE: "10,000",
    NODE_VERSION: "14",
    PYTHON_VERSION: "3.8",
    CONFIGURED_PROPS_SIZE_LIMIT: "64KB",
    SERVICE_DB_SIZE_LIMIT: "60KB",
    TMP_SIZE_LIMIT: "512MB",
  },
};
