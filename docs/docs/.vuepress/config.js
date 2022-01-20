const path = require("path");
const webpack = require("webpack");

module.exports = {
  title: "",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  description: "Pipedream Documentation - Connect APIs, remarkably fast",
  base: "/docs-v2/",
  plugins: [
    '@vuepress/active-header-links',
    "versioning",
    [
      "vuepress-plugin-canonical",
      {
        baseURL: "https://pipedream.com/docs", // base url for your canonical link, optional, default: ''
        stripExtension: true,
      },
    ],
  ],
  themeConfig: {
    algolia: {
      apiKey: "1e23962724b59d018bdedc0f5a214ce5",
      indexName: "pipedream",
    },
    searchPlaceholder: "Search...",
    logo: "/pipedream.svg",
    repo: "PipedreamHQ/pipedream",

    // Optional options for generating "Edit this page" link

    // if your docs are not at the root of the repo:
    docsDir: "docs/docs",
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: "Help us improve this page! Submit an edit on Github",
    sidebar: [
      "/",
      {
        title: "Quickstart",
        children: [
          "/quickstart/",
          "/quickstart/hello-world/",
          "/quickstart/hello-name/",
          "/quickstart/make-http-request/",
          "/quickstart/using-npm-packages/",
          "/quickstart/add-data-to-google-sheets/",
          "/quickstart/end-workflow-early/",
          "/quickstart/use-managed-auth-in-code/",
          "/quickstart/run-workflow-on-a-schedule/",
          "/quickstart/email-yourself/",
          "/quickstart/real-world-example/",
          "/quickstart/next-steps/",
        ],
      },
      {
        title: "Code",
        collapsable: false,
        children: [
          "/code/",
          {
            title: "Node.js",
            // type: 'group',
            children: [
              "/code/nodejs/",
              // "/code/nodejs/state/",
              // "/code/nodejs/http-requests/",
              // "/code/nodejs/working-with-files/",
              // "/code/nodejs/sharing-code/",
              // "/code/nodejs/async/",
            ]
          },
          {
            title: 'Python',
            type: 'group',
            children: [
              '/code/python/'
            ]
          },
          {
            title: 'Go',
            type: 'group',
            children: [
              '/code/go/',
            ]
          },
          {
            title: 'Bash',
            type: 'group',
            children: [
              '/code/bash/'
            ]
          }

        ]
      },
      {
        title: "Workflows",
        
        children: [
          "/workflows/",
          "/workflows/steps/",
          "/workflows/steps/triggers/",
          "/components/actions/",
          "/workflows/networking/",
          "/workflows/steps/params/",

        ],
      },
      {
        title: "Connecting Apps",
        // collapsable: false, 
        children: [
          "/apps/all-apps/",
          "/connected-accounts/",
          "/workflows/steps/code/auth/",
        ],
      },
      {
        title: "Workflow Events",
        
        children: [
          "/workflows/events/",
          "/workflows/events/inspect/",
          "/workflows/events/replay/",
          "/workflows/events/test/",
          "/workflows/events/concurrency-and-throttling/",
          "/workflows/events/cold-starts/",
        ],
      },
      {
        title: "Managing Workflows",
        
        children: [
          "/workflows/copy/",
          "/workflows/managing/",
          "/workflows/settings/",
          "/public-workflows/",
          "/environment-variables/",
        ],
      },
      {
        title: "Managing Errors",
        
        children: [
          "/errors/",
          "/workflows/error-handling/global-error-workflow/",
        ],
      },
      {
        title: "Components",
        
        children: [
          "/components/",
          "/event-sources/",
          "/components/actions/",
          "/components/quickstart/nodejs/actions/",
          "/components/quickstart/nodejs/sources/",
          "/components/api/",
          "/components/guidelines/",
          "/pipedream-axios/",
          "/components/migrating/",
        ],
      },
      "/user-settings/",
      {
        title: "Examples",
        
        children: [
          "/examples/adding-rows-to-google-sheets/",
          "/examples/waiting-to-execute-next-step-of-workflow/",
        ],
      },
      {
        title: "CLI",
        
        children: ["/cli/install/", "/cli/login/", "/cli/reference/"],
      },
      {
        title: "APIs",
        
        children: [
          "/api/overview/",
          "/api/auth/",
          "/api/rest/",
          "/api/rest/webhooks/",
          "/api/rest/rss/",
          "/api/rest/workflow-errors/",
          "/api/sse/",
        ],
      },
      {
        title: "Destinations",
        
        children: [
          "/destinations/",
          "/destinations/http/",
          "/destinations/s3/",
          "/destinations/email/",
          "/destinations/sql/",
          "/destinations/emit/",
          "/destinations/sse/",
        ],
      },
      {
        title: "Integrations",
        
        children: [
          "/apps/all-apps/",
          "/apps/discord/",
          "/apps/hubspot/",
          "/apps/servicenow/",
          "/apps/slack/",
          "/apps/strava/",
          "/apps/twitter/",
          "/apps/zoom/",
        ],
      },
      "/limits/",
      "/new-feature-or-bug/",
      {
        title: "Privacy & Security",
        
        children: [
          "/privacy-and-security/",
          "/privacy-and-security/best-practices/",
          "/abuse/",
          "/privacy-and-security/pgp-key/",
          "/subprocessors/",
        ],
      },
      ["https://pipedream.com/support", "Support and Community"],
      "/troubleshooting/",
      {
        title: "Organizations",
        
        children: [
          "/orgs/",
          "/orgs/sso/okta/",
        ],
      },
      "/pricing/",
      "/status/",
    ],
    PIPEDREAM_BASE_URL: "https://pipedream.com",
    API_BASE_URL: "https://api.pipedream.com/v1",
    SQL_API_BASE_URL: "https://rt.pipedream.com/sql",
    PAYLOAD_SIZE_LIMIT: "512KB",
    MEMORY_LIMIT: "256MB",
    MEMORY_ABSOLUTE_LIMIT: "10GB",
    EMAIL_PAYLOAD_SIZE_LIMIT: "150KB",
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
  },
};
