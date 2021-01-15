const path = require("path");
const webpack = require("webpack");

module.exports = {
  title: "",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  description: "Pipedream Documentation - Integrate your apps, data and APIs",
  base: "/",
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
      ["/support/", "Support and Community"],
      "/sign-up/",
      "/pricing/",
      {
        title: "Getting Started",
        collapsable: false,
        children: ["/workflows/", "/your-first-workflow/"],
      },
      /* {
        title: "Video Tutorials",
        collapsable: false,
        children: [
          "/workflows/examples/send-http-request/",
          "/workflows/examples/http-response/",
          "/workflows/examples/trigger-workflow-on-saas-event/",
          "/workflows/examples/cron-job/",
          "/workflows/examples/send-yourself-email/",
          "/workflows/examples/send-email-to-someone-else/",
          "/workflows/examples/add-row-to-google-sheets/",
          "/workflows/examples/add-multiple-rows-to-google-sheets/",
          "/workflows/examples/send-slack-message/",
          "/workflows/examples/send-discord-message/",
          "/workflows/examples/add-record-to-airtable/",
        ],
      }, */
      {
        title: "Event Sources",
        collapsable: false,
        children: ["/event-sources/", "/event-sources/logs/"],
      },
      {
        title: "Workflow Steps",
        collapsable: false,
        children: [
          "/workflows/steps/",
          "/workflows/steps/triggers/",
          "/workflows/steps/code/",
          "/workflows/steps/code/state/",
          "/workflows/steps/code/nodejs/http-requests/",
          "/workflows/steps/code/nodejs/working-with-files/",
          "/workflows/steps/actions/",
          "/workflows/steps/params/",
          "/workflows/steps/code/nodejs/sharing-code/",
          "/workflows/steps/code/async/",
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
        title: "Connecting to Apps",
        collapsable: false,
        children: [
          "/apps/all-apps/",
          "/connected-accounts/",
          "/workflows/steps/code/auth/",
        ],
      },
      {
        title: "Errors",
        collapsable: false,
        children: [
          "/errors/",
          "/workflows/error-handling/global-error-workflow/",
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
      "/user-settings/",
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
          "/apps/intercom/",
          "/apps/servicenow/",
          "/apps/slack/",
          "/apps/strava/",
          "/apps/twitter/",
          "/apps/zoho-books/",
          "/apps/zoho-crm/",
          "/apps/zoho-mail/",
          "/apps/zoom/",
        ],
      },
      "/limits/",
      "/new-feature-or-bug/",
      {
        title: "Security",
        collapsable: false,
        children: ["/security/", "/security/pgp-key/"],
      },
      "/status/",
    ],
    PIPEDREAM_BASE_URL: "https://pipedream.com",
    API_BASE_URL: "https://api.pipedream.com/v1",
    SQL_API_BASE_URL: "https://rt.pipedream.com/sql",
    PAYLOAD_SIZE_LIMIT: "512KB",
    EMAIL_PAYLOAD_SIZE_LIMIT: "150KB",
    INSPECTOR_EVENT_LIMIT: "100",
    FUNCTION_PAYLOAD_LIMIT: "8MB",
    INSPECTOR_EVENT_EXPIRY_DAYS: "30",
    DAILY_INVOCATIONS_LIMIT: "3,333",
    PRICE_PER_INVOCATION: "0.0001",
    DEFAULT_WORKFLOW_QUEUE_SIZE: "100",
    MAX_WORKFLOW_QUEUE_SIZE: "10,000",
    NODE_VERSION: "10",
  },
};
