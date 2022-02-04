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
          "/concepts/workflows/",
          "/concepts/workflows/events/",
          "/concepts/workflows/concurrency-and-throttling/",
          "/concepts/workflows/settings/",
          "/concepts/workflows/networking/",
        ],
      },
      { title: "Steps", children: ["/concepts/steps/"] },
      { title: "Integrate", children: ["/concepts/integrate/"] },
      { title: "Triggers", children: ["/concepts/triggers/"] },
    ],
  },
  {
    title: "Advanced",
    collapsable: false,
    initialOpenGroupIndex: -1,
    children: [
      { title: "Code", children: ["/code/"] },
      { title: "Components", children: ["/components/"] },
    ],
  },
];

module.exports = {
  "/quickstart/": ["/quickstart/", "/quickstart/create-new-workflow.md"],
  "/concepts/": conceptsNav,
  "/": conceptsNav,
};

// OLD NAV
// module.exports = [
//   "/",
//   "/quickstart/",
//   {
//     title: "Workflows",
//     children: [
//       "/workflows/",
//       "/workflows/steps/",
//       "/workflows/steps/triggers/",
//       "/workflows/events/",
//       "/components/actions/",
//       "/workflows/concurrency-and-throttling/",
//       "/environment-variables/",
//       "/workflows/settings/",
//       "/workflows/networking/",
//     ],
//   },
//   "/sources/",
//   "/connected-accounts/",
//   "/user-settings/",
//   {
//     title: "Organizations",
//     children: ["/orgs/", "/orgs/sso/okta/"],
//   },
//   {
//     title: "Reference: Code, APIs + CLI",
//     children: [
//       {
//         title: "Writing Code in Workflows",
//         type: "group",
//         initialOpenGroupIndex: 1,
//         children: [
//           "/code/",
//           {
//             title: "Node.js",
//             type: "group",
//             children: [
//               "/code/nodejs/",
//               "/code/nodejs/auth/",
//               "/code/nodejs/http-requests/",
//               "/code/nodejs/working-with-files/",
//               "/code/nodejs/async/",
//             ],
//           },
//           "/code/python/",
//           "/code/go/",
//           "/code/bash/",
//           "/destinations/",
//         ],
//       },
//       {
//         title: "Authoring Components",
//         type: "group",
//         children: [
//           "/components/",
//           "/components/quickstart/nodejs/actions/",
//           "/components/quickstart/nodejs/sources/",
//           "/components/api/",
//           "/components/guidelines/",
//           "/pipedream-axios/",
//         ],
//       },
//       {
//         title: "CLI",
//         type: "group",
//         children: ["/cli/install/", "/cli/login/", "/cli/reference/"],
//       },
//       {
//         title: "APIs",
//         type: "group",
//         children: [
//           "/api/overview/",
//           "/api/auth/",
//           "/api/rest/",
//           "/api/rest/webhooks/",
//           "/api/rest/rss/",
//           "/api/rest/workflow-errors/",
//           "/api/sse/",
//         ],
//       },
//       {
//         title: "Integrations",
//         type: "group",
//         children: [
//           "/apps/all-apps/",
//           "/apps/discord/",
//           "/apps/hubspot/",
//           "/apps/servicenow/",
//           "/apps/slack/",
//           "/apps/strava/",
//           "/apps/twitter/",
//           "/apps/zoom/",
//         ],
//       },
//     ],
//   },
//   "/troubleshooting/",
//   {
//     title: "Privacy & Security",
//     children: [
//       "/privacy-and-security/",
//       "/privacy-and-security/best-practices/",
//       "/abuse/",
//       "/privacy-and-security/pgp-key/",
//       "/subprocessors/",
//     ],
//   },
//   {
//     title: "Pricing & Limits",
//     collapsable: true,
//     children: ["/limits/", "/pricing/", "/workflows/events/cold-starts/"],
//   },
//   "/status/",
//   ["https://pipedream.com/support", "Need more help?"],
// ];
