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
      "/components/actions/",
      "/workflows/concurrency-and-throttling/",
      "/environment-variables/",
      "/workflows/settings/",
      "/workflows/networking/",
      "/migrate-from-v1/",
    ],
  },
  "/sources/",
  "/connected-accounts/",
  "/user-settings/",
  {
    title: "Data Stores",
    children: [
      "/data-stores/",
      "/data-stores/pre-built-actions/",
      "/data-stores/managing-data-stores/",
    ],
  },
  {
    title: "Settings",
    children: ["/user-settings/"],
  },
  {
    title: "Organizations",
    children: ["/orgs/", "/orgs/sso/okta/"],
  },
  {
    title: "Code",
    children: [
      "/code/",
      "/migrate-from-v1/",
      {
        title: "Node.js",
        type: "group",
        children: [
          "/code/nodejs/",
          "/code/nodejs/auth/",
          "/code/nodejs/http-requests/",
          "/code/nodejs/working-with-files/",
          "/code/nodejs/using-data-stores/",
          "/code/nodejs/async/",
          "/environment-variables/",
        ],
      },
      "/code/python/",
      "/code/go/",
      {
        title: "Bash",
        type: "group",
        children: ["/code/bash/", "/code/bash/http-requests/"],
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
        ],
      },
      "/destinations/",
      "/workflows/concurrency-and-throttling/",
      "/environment-variables/",
      "/workflows/settings/",
      "/workflows/networking/",
      "/migrate-from-v1/",
    ],
  },
  {
    title: "Troubleshooting",
    children: ["/troubleshooting/"],
  },
];

const securityNav = [
  "/privacy-and-security/",
  "/privacy-and-security/best-practices/",
  "/abuse/",
  "/privacy-and-security/pgp-key/",
  "/subprocessors/",
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
];

const pricingNav = ["/pricing/", "/limits/", "/workflows/events/cold-starts/"];

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
  "/privacy-and-security/": securityNav,
  "/subprocessors/": securityNav,
  "/abuse/": securityNav,
  "/pricing/": pricingNav,
  "/limits/": pricingNav,
  "/workflows/events/cold-starts/": pricingNav,
  "/": docsNav,
};
