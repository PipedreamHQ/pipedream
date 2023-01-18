// NEW NAV

const docsNav = [
  "/quickstart/",
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
      "/workflows/built-in-functions/",
      "/workflows/errors/",
      "/workflows/concurrency-and-throttling/",
      "/workflows/settings/",
      "/workflows/networking/",
      "/workflows/workspaces/",
      "/migrate-from-v1/",
    ],
  },
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
        children: [
          "/code/nodejs/",
          "/code/nodejs/auth/",
          "/code/nodejs/http-requests/",
          "/code/nodejs/working-with-files/",
          "/code/nodejs/using-data-stores/",
          "/code/nodejs/delay/",
          "/code/nodejs/rerun/",
          "/environment-variables/",
          "/code/nodejs/async/",
          "/code/nodejs/sharing-code/",
        ],
      },
      {
        title: "Python",
        type: "group",
        children: [
          "/code/python/",
          "/code/python/auth/",
          "/code/python/using-data-stores/",
          "/code/python/rerun/",
          "/code/python/import-mappings/",
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
  ["/troubleshooting/", "Troubleshooting"],
  {
    title: "Settings",
    children: ["/user-settings/", "/workspace-settings/"],
  },
  {
    title: "Organizations",
    children: ["/orgs/", "/orgs/sso/okta/"],
  },
];

const referenceNav = [
  {
    title: "Components",
    children: [
      "/components/",
      "/components/quickstart/nodejs/actions/",
      "/components/quickstart/nodejs/sources/",
      "/components/api/",
      "/components/guidelines/",
      "/pipedream-axios/",
      "/components/typescript/",
    ],
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
  "/workflows/events/cold-starts/",
];

const pricingNav = ["/pricing/"];

module.exports = {
  // reference nav
  "/components/": referenceNav,
  "/components/quickstart/nodejs/actions/": referenceNav,
  "/components/quickstart/nodejs/sources/": referenceNav,
  "/components/api/": referenceNav,
  "/components/guidelines/": referenceNav,
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
  "/workflows/events/cold-starts/": referenceNav,
  "/abuse/": referenceNav,
  // pricing nav
  "/pricing/": pricingNav,
  // main nav
  "/": docsNav,
};
