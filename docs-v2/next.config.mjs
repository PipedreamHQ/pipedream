import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
});

export default withNextra({
  basePath: "/docs",
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/v3/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/v3/:path*/",
        destination: "/:path*/",
        permanent: true,
      },
      {
        source: "/what-is-pipedream/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/integrations/",
        destination: "/integrations/apps/",
        permanent: true,
      },
      {
        source: "/apps/",
        destination: "/integrations/apps/",
        permanent: true,
      },
      {
        source: "/apps/app-partners/",
        destination: "/integrations/app-partners/",
        permanent: true,
      },
      {
        source: "/apps/guide/requesting-additional-oauth-scopes/",
        destination: "/integrations/oauth-clients/",
        permanent: true,
      },
      {
        source: "/apps/contributing/",
        destination: "/workflows/contributing/",
        permanent: true,
      },
      {
        source: "/apps/all-apps/",
        destination: "https://pipedream.com/apps/",
        permanent: true,
      },
      {
        source: "/apps/:path*/",
        destination: "https://pipedream.com/apps/:path*/",
        permanent: true,
      },
      {
        source: "/support/",
        destination: "https://pipedream.com/support/",
        permanent: true,
      },
      {
        source: "/security/",
        destination: "/privacy-and-security/",
        permanent: true,
      },
      {
        source: "/user-settings/",
        destination: "/account/user-settings/",
        permanent: true,
      },
      {
        source: "/quickstart/run-workflow-on-a-schedule/",
        destination: "/quickstart/",
        permanent: true,
      },
      {
        source: "/quickstart/github-sync/",
        destination: "/workflows/git/",
        permanent: true,
      },
      {
        source: "/cron/",
        destination: "/workflows/building-workflows/triggers/",
        permanent: true,
      },
      {
        source: "/notebook/",
        destination: "/workflows/",
        permanent: true,
      },
      {
        source: "/notebook/actions/",
        destination: "/workflows/building-workflows/actions/",
        permanent: true,
      },
      {
        source: "/notebook/fork/",
        destination: "/workflows/building-workflows/sharing/",
        permanent: true,
      },
      {
        source: "/notebook/inspector/",
        destination: "/workflows/building-workflows/inspect/",
        permanent: true,
      },
      {
        source: "/notebook/destinations/snowflake/",
        destination: "/workflows/data-management/databases/",
        permanent: true,
      },
      {
        source: "/notebook/destinations/:path*/",
        destination: "/workflows/data-management/destinations/:path*/",
        permanent: true,
      },
      {
        source: "/notebook/destinations/",
        destination: "/workflows/data-management/destinations/",
        permanent: true,
      },
      {
        source: "/notebook/code/",
        destination: "/workflows/building-workflows/code/",
        permanent: true,
      },
      {
        source: "/notebook/observability/",
        destination: "/workflows/building-workflows/inspect/",
        permanent: true,
      },
      {
        source: "/notebook/sources/",
        destination: "/workflows/building-workflows/triggers/",
        permanent: true,
      },
      {
        source: "/notebook/sql/",
        destination: "/workflows/data-management/databases/working-with-sql/",
        permanent: true,
      },
      {
        source: "/sources/",
        destination: "/workflows/building-workflows/triggers/",
        permanent: true,
      },
      {
        source: "/destinations/",
        destination: "/workflows/data-management/destinations/",
        permanent: true,
      },
      {
        source: "/destinations/:path*/",
        destination: "/workflows/data-management/destinations/:path*/",
        permanent: true,
      },
      {
        source: "/projects/",
        destination: "/workflows/projects/",
        permanent: true,
      },
      {
        source: "/projects/git/",
        destination: "/workflows/git/",
        permanent: true,
      },
      {
        source: "/projects/file-stores/",
        destination: "/workflows/data-management/file-stores/",
        permanent: true,
      },
      {
        source: "/projects/file-stores/:path*/",
        destination: "/workflows/data-management/file-stores/:path*/",
        permanent: true,
      },
      {
        source: "/projects/:path*/",
        destination: "/workflows/projects/:path*/",
        permanent: true,
      },
      {
        source: "/event-history/",
        destination: "/workflows/event-history/",
        permanent: true,
      },
      {
        source: "/workflows/building-workflows/",
        destination: "/workflows/",
        permanent: true,
      },
      {
        source: "/workflows/concurrency-and-throttling/",
        destination:
          "/workflows/building-workflows/settings/concurrency-and-throttling/",
        permanent: true,
      },
      {
        source: "/workflows/steps/",
        destination: "/workflows/#steps",
        permanent: true,
      },
      {
        source: "/workflows/fork/",
        destination: "/workflows/building-workflows/sharing/",
        permanent: true,
      },
      {
        source: "/workflows/steps/code/async/",
        destination: "/workflows/building-workflows/code/nodejs/async/",
        permanent: true,
      },
      {
        source: "/workflows/steps/code/state/",
        destination: "/workflows/#step-exports",
        permanent: true,
      },
      {
        source: "/workflows/steps/params/",
        destination: "/workflows/building-workflows/using-props/",
        permanent: true,
      },
      {
        source: "/workflows/events/cold-starts/",
        destination:
          "/workflows/building-workflows/settings/#eliminate-cold-starts",
        permanent: true,
      },
      {
        source: "/workflows/examples/waiting-to-execute-next-step-of-workflow/",
        destination: "/workflows/building-workflows/code/nodejs/delay/",
        permanent: true,
      },
      {
        source: "/workflows/networking/",
        destination: "/workflows/vpc/",
        permanent: true,
      },
      {
        source: "/workflows/built-in-functions/",
        destination: "/workflows/building-workflows/actions/",
        permanent: true,
      },
      {
        source: "/workflows/events/inspect/",
        destination: "/workflows/building-workflows/inspect/",
        permanent: true,
      },
      {
        source: "/workflows/triggers/",
        destination: "/workflows/building-workflows/triggers/",
        permanent: true,
      },
      {
        source: "/workflows/steps/triggers/",
        destination: "/workflows/building-workflows/triggers/",
        permanent: true,
      },
      {
        source: "/workflows/actions/",
        destination: "/workflows/building-workflows/actions/",
        permanent: true,
      },
      {
        source: "/workflows/steps/actions/",
        destination: "/workflows/building-workflows/actions/",
        permanent: true,
      },
      {
        source: "/workflows/flow-control/",
        destination: "/workflows/building-workflows/control-flow/",
        permanent: true,
      },
      {
        source: "/workflows/control-flow/",
        destination: "/workflows/building-workflows/control-flow/",
        permanent: true,
      },
      {
        source: "/workflows/sharing/",
        destination: "/workflows/building-workflows/sharing/",
        permanent: true,
      },
      {
        source: "/code/",
        destination: "/workflows/building-workflows/code/",
        permanent: true,
      },
      {
        source: "/code/:path*/",
        destination: "/workflows/building-workflows/code/:path*/",
        permanent: true,
      },
      {
        source: "/http/",
        destination: "/workflows/building-workflows/http/",
        permanent: true,
      },
      {
        source: "/environment-variables/",
        destination: "/workflows/environment-variables/",
        permanent: true,
      },
      {
        source: "/components/quickstart/nodejs/actions/",
        destination: "/workflows/contributing/components/actions-quickstart/",
        permanent: true,
      },
      {
        source: "/components/",
        destination: "/workflows/contributing/components/",
        permanent: true,
      },
      {
        source: "/components/:path*/",
        destination: "/workflows/contributing/components/:path*/",
        permanent: true,
      },
      {
        source: "/github-sync/",
        destination: "/workflows/git/",
        permanent: true,
      },
      {
        source: "/workspaces/",
        destination: "/workflows/workspaces/",
        permanent: true,
      },
      {
        source: "/workspaces/okta/",
        destination: "/workflows/workspaces/sso/okta/",
        permanent: true,
      },
      {
        source: "/workspaces/google/",
        destination: "/workflows/workspaces/sso/google/",
        permanent: true,
      },
      {
        source: "/workspaces/saml/",
        destination: "/workflows/workspaces/sso/saml/",
        permanent: true,
      },
      {
        source: "/workspaces/:path*/",
        destination: "/workflows/workspaces/:path*/",
        permanent: true,
      },
      {
        source: "/workspaces-and-credits-faq/",
        destination: "/pricing/faq/",
        permanent: true,
      },
      {
        source: "/connected-accounts/api/",
        destination: "/connect/api/#accounts/",
        permanent: true,
      },
      {
        source: "/connected-accounts/",
        destination: "/integrations/connected-accounts/",
        permanent: true,
      },
      {
        source: "/connected-accounts/:path*/",
        destination: "/integrations/connected-accounts/:path*/",
        permanent: true,
      },
      {
        source: "/api/",
        destination: "/rest-api/",
        permanent: true,
      },
      {
        source: "/api/:path*/",
        destination: "/rest-api/:path*/",
        permanent: true,
      },
      {
        source: "/data-stores/",
        destination: "/workflows/data-management/data-stores/",
        permanent: true,
      },
      {
        source: "/databases/",
        destination: "/workflows/data-management/databases/",
        permanent: true,
      },
      {
        source: "/databases/:path*/",
        destination: "/workflows/data-management/databases/:path*/",
        permanent: true,
      },
      {
        source: "/cli/",
        destination: "/workflows/cli/reference/",
        permanent: true,
      },
      {
        source: "/cli/reference/",
        destination: "/workflows/cli/reference/",
        permanent: true,
      },
      {
        source: "/cli/login/",
        destination: "/workflows/cli/login/",
        permanent: true,
      },
      {
        source: "/connect/connect-link/",
        destination: "/connect/managed-auth/connect-link/",
        permanent: true,
      },
      {
        source: "/connect/customize-your-app/",
        destination: "/connect/managed-auth/customization/",
        permanent: true,
      },
      {
        source: "/connect/oauth-clients/",
        destination: "/connect/managed-auth/oauth-clients/",
        permanent: true,
      },
      {
        source: "/connect/quickstart/",
        destination: "/connect/managed-auth/quickstart/",
        permanent: true,
      },
      {
        source: "/connect/tokens/",
        destination: "/connect/managed-auth/tokens/",
        permanent: true,
      },
      {
        source: "/connect/webhooks/",
        destination: "/connect/managed-auth/webhooks/",
        permanent: true,
      },
      {
        source: "/integrations/connected-accounts/oauth-clients/",
        destination: "/integrations/oauth-clients/",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/shopify-faq-2023-10",
        destination: "/deprecated/shopify-faq-2023-10",
      },
      {
        source: "/abuse",
        destination: "/hidden/abuse",
      },
      {
        source: "/scheduling-future-tasks",
        destination: "/hidden/scheduling-future-tasks",
      },
      {
        source: "/status",
        destination: "/hidden/status",
      },
      {
        source: "/subprocessors",
        destination: "/hidden/subprocessors",
      },
    ];
  },
  env: {
    PIPEDREAM_NODE_VERSION: "20",
    PIPEDREAM_BASE_URL: "https://pipedream.com",
    API_BASE_URL: "https://api.pipedream.com/v1",
    SQL_API_BASE_URL: "https://rt.pipedream.com/sql",
    ENDPOINT_BASE_URL: "*.m.pipedream.net",
    PAYLOAD_SIZE_LIMIT: "512KB",
    MEMORY_LIMIT: "256MB",
    MEMORY_ABSOLUTE_LIMIT: "10GB",
    EMAIL_PAYLOAD_SIZE_LIMIT: "30MB",
    MAX_WORKFLOW_EXECUTION_LIMIT: "750",
    BASE_CREDITS_PRICE_MEMORY: "256",
    BASE_CREDITS_PRICE_SECONDS: "30",
    DAILY_TESTING_LIMIT: "30 minutes",
    INSPECTOR_EVENT_EXPIRY_DAYS: "365",
    FUNCTION_PAYLOAD_LIMIT: "6MB",
    DEFAULT_WORKFLOW_QUEUE_SIZE: "100",
    MAX_WORKFLOW_QUEUE_SIZE: "10,000",
    PYTHON_VERSION: "3.12",
    GO_LANG_VERSION: "1.21.5",
    CONFIGURED_PROPS_SIZE_LIMIT: "64KB",
    SERVICE_DB_SIZE_LIMIT: "60KB",
    TMP_SIZE_LIMIT: "2GB",
    DELAY_MIN_MAX_TIME:
      "You can pause your workflow for as little as one millisecond, or as long as one year",
    PUBLIC_APPS: "2,500",
    REGISTRY_ACTIONS: "5,300",
    REGISTRY_SOURCES: "2,500",
    REGISTRY_COMPONENTS: "8,000",
    FREE_INSPECTOR_EVENT_LIMIT: "7 days of events",
    WARM_WORKERS_INTERVAL: "10 minutes",
    WARM_WORKERS_CREDITS_PER_INTERVAL: "5",
    ALGOLIA_APP_ID: "XY28M447C5",
    ALGOLIA_SEARCH_API_KEY: "a7d274c84696bac04e14cc87139d9eaf",
    ALGOLIA_INDEX_NAME: "pipedream",
    PD_EGRESS_IP_RANGE: "44.223.89.56/29",
  },
});
