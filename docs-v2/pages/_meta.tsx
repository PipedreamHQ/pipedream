export default {
  "index": "Introduction",
  "workspaces": "Workspaces",
  "projects": "Projects",
  "--connect": {
    type: "separator",
    title: "Connect",
  },
  "connect": {
    title: "Overview",
    // display: "children",
  },
  "--workflows": {
    type: "separator",
    title: "Workflows",
  },
  "workflows": {
    title: "Workflows",
    // display: "children",
  },
  "--platform": {
    type: "separator",
    title: "Platform",
  },
  "apps": "Apps",
  "components": "Components",
  "rest-api": "REST API",
  "pricing": "Pricing",
  "account": "Account",
  "privacy-and-security": "Security",
  "troubleshooting": "Troubleshooting",
  "glossary": "Glossary of Terms",
  "support": {
    title: "Support",
    type: "page",
    href: "https://pipedream.com/support",
    newWindow: true,
  },
  "pricing-page": {
    title: "Pricing",
    href: "https://pipedream.com/pricing",
    newWindow: true,
    type: "page",
  },
  "statuspage": {
    title: "Status",
    type: "page",
    href: "https://status.pipedream.com",
    newWindow: true,
  },
  "deprecated": {
    display: "hidden",
  },
  "hidden": {
    display: "hidden",
  },
} as const
