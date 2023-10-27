const path = require("path");
const webpack = require("webpack");

module.exports = {
  title: "",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ['meta', { name: 'version', content: 1 }]
  ],
  description: "Pipedream Documentation - Connect APIs, remarkably fast",
  base: "/docs/v1/",
  plugins: [
    // [
    //   "vuepress-plugin-canonical",
    //   {
    //     baseURL: "https://pipedream.com/docs/", // base url for your canonical link, optional, default: ''
    //     stripExtension: true,
    //   },
    // ],
  ],
  themeConfig: {
    algolia: {
      appId: "XY28M447C5",
      // apiKey: "1e23962724b59d018bdedc0f5a214ce5",
      apiKey: "9d9169458128b3d60c22bb04da4431c7",
      indexName: "pipedream",
      algoliaOptions: {
        facetFilters: ['version:1']
      }
    },
    searchPlaceholder: "Search...",
    logo: "/pipedream.svg",
    repo: "PipedreamHQ/pipedream",
    nav: [
      {
        text: "v1",
        ariaLabel: "Docs Version Menu",
        items: [
          {
            text: "v1",
            link: "https://pipedream.com/docs/v1",
            internal: true,
            badge: "Deprecated",
            badgeVariation: "danger",
          },
          {
            text: "v2",
            internal: true,
            badge: "New",
            badgeVariation: "primary",
            link: "https://pipedream.com/docs",
          },
        ],
      },
    ],

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
        collapsable: false,
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
        title: "Workflows",
        collapsable: false,
        children: [
          "/workflows/",
          "/workflows/steps/",
          "/workflows/steps/triggers/",
          "/components/actions/",
          "/workflows/steps/code/",
          "/workflows/steps/params/",
          "/workflows/steps/code/state/",
          "/workflows/steps/code/nodejs/http-requests/",
          "/workflows/steps/code/nodejs/working-with-files/",
          "/workflows/networking/",
          "/workflows/steps/code/nodejs/sharing-code/",
          "/workflows/steps/code/async/",
        ],
      },
      {
        title: "Connecting Apps",
        collapsable: false,
        children: [
          "/apps/all-apps/",
          "/connected-accounts/",
          "/workflows/steps/code/auth/",
        ],
      },
      {
        title: "Workflow Events",
        collapsable: false,
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
        collapsable: false,
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
        collapsable: false,
        children: [
          "/errors/",
          "/workflows/error-handling/global-error-workflow/",
        ],
      },
      {
        title: "Components",
        collapsable: false,
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
        collapsable: false,
        children: [
          "/examples/adding-rows-to-google-sheets/",
          "/examples/waiting-to-execute-next-step-of-workflow/",
        ],
      },
      {
        title: "CLI",
        collapsable: false,
        children: ["/cli/install/", "/cli/login/", "/cli/reference/"],
      },
      {
        title: "APIs",
        collapsable: false,
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
        collapsable: false,
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
        collapsable: false,
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
        collapsable: false,
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
        collapsable: false,
        children: ["/orgs/", "/orgs/sso/okta/"],
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
    CONFIGURED_PROPS_SIZE_LIMIT: "64KB",
  },
};
