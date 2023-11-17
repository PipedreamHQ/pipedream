// NEW NAV

const docsNav = [
  {
    title: "Quickstart",
    children: [
      {
        title: "Develop Workflows",
        path: "/quickstart/",
      },
      {
        title: "Use GitHub Sync",
        path: "/quickstart/github-sync/",
      },
    ]
  },
  "/workspaces/",
  {
    title: "Projects",
    children: [
      "/projects/",
      "/projects/git/"
    ]
  },
  {
    title: "Workflows",
    children: [
      "/workflows/",
      "/workflows/steps/",
      "/workflows/steps/triggers/",
      "/workflows/steps/actions/",
      "/workflows/steps/using-props/",
      "/workflows/events/",
      "/workflows/events/inspect/",
      "/workflows/flow-control/",
      "/workflows/errors/",
      "/workflows/concurrency-and-throttling/",
      "/workflows/settings/",
      "/workflows/vpc/",
      "/workflows/domains/",
      "/workflows/sharing/",
      "/migrate-from-v1/",
    ],
  },
  "/event-history/",
  "/sources/",
  "/connected-accounts/",
  ["/data-stores/", "Data Stores"],
  {
    title: "Code",
    children: [
      "/code/",
      {
        title: "Node.js",
        type: "group",
        collapsable: false,
        sidebarDepth: 2,
        children: [
          "/code/nodejs/",
          "/code/nodejs/ai-code-generation/",
          "/code/nodejs/auth/",
          "/code/nodejs/http-requests/",
          "/code/nodejs/working-with-files/",
          "/code/nodejs/using-data-stores/",
          "/code/nodejs/delay/",
          "/code/nodejs/rerun/",
          "/environment-variables/",
          "/code/nodejs/async/",
          "/code/nodejs/sharing-code/",
          "/code/nodejs/browser-automation/",
          {
            title: "Reference",
            path: "/components/api/#run"
          }
        ],
      },
      {
        title: "Python",
        type: "group",
        collapsable: false,
        sidebarDepth: 2,
        children: [
          "/code/python/",
          "/code/python/auth/",
          "/code/python/using-data-stores/",
          "/code/python/rerun/",
          "/code/python/import-mappings/",
          "/code/python/faqs/",
        ],
      },
      "/code/go/",
      {
        title: "Bash",
        type: "group",
        children: ["/code/bash/", "/code/bash/http-requests/"],
      },
      "/destinations/",
      "/environment-variables/",
    ],
  },
  "/http/",
  {
    title: "Integrations",
    type: "group",
    children: [
      "/apps/",
      "/apps/contributing/",
      {
        title: "Components",
        type: "group",
        collapsable: false,
        children: [
          "/components/",
          "/components/quickstart/nodejs/actions/",
          "/components/quickstart/nodejs/sources/",
          "/pipedream-axios/",
          "/components/typescript/",
          "/components/guidelines/",
        ],
      },
    ],
  },
  ["/troubleshooting/", "Troubleshooting"],
  ["/user-settings/", "Settings"],
  {
    title: "Single-Sign On (SSO)",
    children: [
      "/workspaces/sso/",
      "/workspaces/sso/okta/",
      "/workspaces/sso/google/",
      "/workspaces/sso/saml/",
    ],
  },
];

const referenceNav = [
  {
    title: "Components API",
    children: ["/components/api/"],
  },
  {
    title: "CLI",
    type: "group",
    children: ["/cli/install/", "/cli/login/", "/cli/reference/"],
  },
  {
    title: "API",
    type: "group",
    children: [
      "/api/",
      "/api/auth/",
      "/api/rest/",
      "/api/rest/webhooks/",
      "/api/rest/rss/",
      "/api/sse/",
    ],
  },
  "/limits/",
  {
    title: "Security and Privacy",
    children: [
      "/privacy-and-security/",
      "/privacy-and-security/best-practices/",
      "/abuse/",
      "/privacy-and-security/pgp-key/",
      "/subprocessors/",
    ],
  },
  "/workflows/settings/#eliminate-cold-starts",
];

const pricingNav = ["/pricing/"];

module.exports = {
  // reference nav
  "/components/api/": referenceNav,
  "/pipedream-axios/": referenceNav,
  "/api/": referenceNav,
  "/api/auth/": referenceNav,
  "/api/rest/": referenceNav,
  "/api/rest/webhooks/": referenceNav,
  "/api/rest/rss/": referenceNav,
  "/api/rest/workflow-errors/": referenceNav,
  "/api/sse/": referenceNav,
  "/scheduling-future-tasks/": referenceNav,
  "/cli/install/": referenceNav,
  "/cli/login/": referenceNav,
  "/cli/reference/": referenceNav,
  "/limits/": referenceNav,
  // security nav
  "/privacy-and-security/": referenceNav,
  "/privacy-and-reference/pgp-key/": referenceNav,
  "/privacy-and-reference/best-practices/": referenceNav,
  "/subprocessors/": referenceNav,
  "/workflows/settings/#eliminate-cold-starts": referenceNav,
  "/abuse/": referenceNav,
  // pricing nav
  "/pricing/": pricingNav,
  // main nav
  "/": docsNav,
};
