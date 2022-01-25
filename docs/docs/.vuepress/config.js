const path = require("path");
const webpack = require("webpack");

module.exports = {
  title: "",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  description: "Pipedream Documentation - Connect APIs, remarkably fast",
  base: "/docs-v2/",
  plugins: [
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
    sidebar: [
      "/",
      "/quickstart/",
      {
        title: "Workflows",
        children: 
        [
          {
            title: "Overview",
            type: "group",
            children: [
              "/workflows/",
              "/workflows/steps/",
              "/workflows/steps/triggers/",
              "/components/actions/",
              "/workflows/concurrency-and-throttling/",
              "/environment-variables/",
            ],
          },
          {
            title: "Managing",
            type: "group",
            children: [
              "/workflows/settings/",
              "/workflows/copy/",
              "/workflows/error-handling/global-error-workflow/",
            ],
          },
        ]
      },
      "/sources/",
      {
        title: "Connected Accounts",
        collapsable: true,
        children: [
          "/connected-accounts/",
          {
            title: "Integrations",
            type: "group",
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
        ]
      },
      "/user-settings/",
      {
        title: "Organizations",
        children: ["/orgs/", "/orgs/sso/okta/"],
      },
      {
        title: "Reference: Code, APIs + CLI",
        collapsable: true,
        children: [
          {
            title: "Writing Code in Workflows",
            type: "group",
            children: [
              "/code/",
              "/code/nodejs/",
              "/code/python/",
              "/code/go/",
              "/code/bash/"
            ],
          },
          {
            title: "Authoring Components",
            type: "group",
            children: [
              "/components/",
              "/components/quickstart/nodejs/actions/",
              "/components/quickstart/nodejs/sources/",
              "/components/api/",
              "/components/guidelines/",
              "/pipedream-axios/",
              //"/components/migrating/",
            ],
          },
          {
            title: "CLI",
            type: "group",
            children: ["/cli/install/", "/cli/login/", "/cli/reference/"],
          },
          {
            title: "APIs",
            type: "group",
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
        ],
      },
      "/troubleshooting/",
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
      // {
      //   title: "Workflow Events",
      //   children: [
      //     "/workflows/events/",
      //     "/workflows/events/inspect/",
      //     "/workflows/events/replay/",
      //     "/workflows/events/test/",
      //     "/workflows/events/concurrency-and-throttling/",
      //     "/workflows/events/cold-starts/",
      //   ],
      // },
      // {
      //   title: "Managing Errors",
      //   children: [
      //     "/errors/",
      //     "/workflows/error-handling/global-error-workflow/",
      //   ],
      // },
      // {
      //   title: "Authoring Components",
      //   children: [
      //     "/components/",
      //     //"/sources/",
      //     //"/components/actions/",
      //     "/components/quickstart/nodejs/actions/",
      //     "/components/quickstart/nodejs/sources/",
      //     "/components/api/",
      //     "/components/guidelines/",
      //     "/pipedream-axios/",
      //     "/components/migrating/",
      //   ],
      // },
      // {
      //   title: "Examples",
      //   children: [
      //     "/examples/adding-rows-to-google-sheets/",
      //     "/examples/waiting-to-execute-next-step-of-workflow/",
      //   ],
      // },
      // {
      //   title: "CLI",
      //   children: ["/cli/install/", "/cli/login/", "/cli/reference/"],
      // },
      // {
      //   title: "APIs",
      //   children: [
      //     "/api/overview/",
      //     "/api/auth/",
      //     "/api/rest/",
      //     "/api/rest/webhooks/",
      //     "/api/rest/rss/",
      //     "/api/rest/workflow-errors/",
      //     "/api/sse/",
      //   ],
      // },
      // {
      //   title: "Destinations",
      //   children: [
      //     "/destinations/",
      //     "/destinations/http/",
      //     "/destinations/s3/",
      //     "/destinations/email/",
      //     "/destinations/sql/",
      //     "/destinations/emit/",
      //     "/destinations/sse/",
      //   ],
      // },
      // {
      //   title: "Integrations",
      //   children: [
      //     "/apps/all-apps/",
      //     "/apps/discord/",
      //     "/apps/hubspot/",
      //     "/apps/servicenow/",
      //     "/apps/slack/",
      //     "/apps/strava/",
      //     "/apps/twitter/",
      //     "/apps/zoom/",
      //   ],
      // },\
      {
        title: "Limits",
        collapsable: true,
        children: [
          "/limits/",
          "/pricing/",
        ]
      },
      //"/new-feature-or-bug/",
      //["https://pipedream.com/support", "Support and Community"],
      //"/pricing/",
      //"/status/",
      ["https://pipedream.com/support", "Need more help?"],
    ],
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
  },
};
