// NEW NAV

const conceptsNav = [
  {
    title: "Essential",
    collapsable: false,
    initialOpenGroupIndex: -1,
    children: [
      {
        title: "Workflows",
        children: [
          "/workflows/",
          "/workflows/events/",
          "/workflows/concurrency-and-throttling/",
          "/workflows/settings/",
          "/workflows/networking/",
        ],
      },
      { title: "Steps", children: ["/workflows/steps/"] },
      { title: "Integrate", children: ["/integrate/"] },
      { title: "Triggers", children: ["/triggers/"] },
      {
        title: "Account",
        children: [
          "/user-settings/"
        ] 
      },
      {
        title: "Organizations",
        children: [
          "/orgs/",
          "/orgs/sso/okta/",
        ]
      },
      {
        title: "Troubleshooting",
        children: [
          "/troubleshooting/"
        ]
      }
    ],
  },
  {
    title: "Advanced",
    collapsable: false,
    initialOpenGroupIndex: -1,
    children: [
      { title: "Code", children: [
        "/code/",
          {
            title: "Node.js",
            type: "group",
            children: [
              "/code/nodejs/",
              "/code/nodejs/auth/",
              "/code/nodejs/http-requests/",
              "/code/nodejs/working-with-files/",
              "/code/nodejs/managing-state/",
              "/code/nodejs/async/",
            ],
          },
          "/code/python/",
          "/code/go/",
          {
            title: 'Bash',
            type: 'group',
            children: [
              '/code/bash/',
              '/code/bash/http-requests/'
            ]
          },
          {
            title: "API",
            type: "group",
            children: [
            "/api/overview/",
            "/api/auth/",
            "/api/rest/",
            "/api/rest/webhooks/",
            "/api/rest/rss/",
            "/api/rest/workflow-errors/",
            "/api/sse/",
            ]
          },
          "/destinations/", 
          "/workflows/concurrency-and-throttling/",
          "/environment-variables/",
          "/workflows/settings/",
          "/workflows/networking/",
          "/scheduling-future-tasks/",
          "/migrate-from-v1/",
      ] },
      {
        title: "Components", 
        children: [
          "/components/",
          "/components/quickstart/nodejs/actions/",
          "/components/quickstart/nodejs/sources/",
          "/components/api/",
          "/components/guidelines/",
          "/pipedream-axios/",
        ]
      },
    ],
  },
];

const securityNav = [
  "/privacy-and-security/",
  "/privacy-and-security/best-practices/",
  "/abuse/",
  "/privacy-and-security/pgp-key/",
  "/subprocessors/"
];

const pricingNav = [
  "/pricing/",
  "/limits/",
  "/workflows/events/cold-starts/", 
]

module.exports = {
  "/quickstart/": ["/quickstart/"],
  "/privacy-and-security/": securityNav,
  "/subprocessors/": securityNav,
  "/abuse/": securityNav,
  "/pricing/": pricingNav,
  "/limits/": pricingNav,
  "/workflows/events/cold-starts/": pricingNav,
  "/": conceptsNav,
};
