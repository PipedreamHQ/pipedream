// NEW NAV

const docsNav = [
  "/quickstart/",
  {
    title: "Workflows",
    children: [
      "/workflows/",
      "/workflows/steps/",
      "/workflows/steps/triggers/",
      "/workflows/events/",
      "/workflows/events/inspect/",
      "/workflows/events/test/",
      "/components/actions/",
      "/workflows/concurrency-and-throttling/",
      "/workflows/settings/",
      "/workflows/networking/",
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
          "/environment-variables/",
          "/code/nodejs/async/",
          "/code/nodejs/sharing-code/"
        ],
      },
      "/code/python/",
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
  ['/troubleshooting/', 'Troubleshooting'],
  ['/user-settings/', 'Settings'],
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
      "/api/rest/workflow-errors/",
      "/api/sse/",
      "/scheduling-future-tasks/",
    ],
  },
  "/limits/",
  "/workflows/events/cold-starts/",
  {
    title: "Security and Privacy",
    children: [
      "/privacy-and-security/",
      "/privacy-and-security/best-practices/",
      "/abuse/",
      "/privacy-and-security/pgp-key/",
      "/subprocessors/",
    ]
  }
];

const pricingNav = ["/pricing/"];

module.exports = {
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
  "/privacy-and-security/": referenceNav,
  "/subprocessors/": referenceNav,
  "/abuse/": referenceNav,
  "/pricing/": pricingNav,
  "/limits/": referenceNav,
  "/cli/install/": referenceNav,
  "/cli/login/": referenceNav,
  "/cli/reference/": referenceNav,
  "/privacy-and-security/": referenceNav,
  "/": docsNav,
};
