module.exports = [
  {
    text: "Get Started",
    link: "/quickstart/",
  },
  {
    text: "Concepts",
    grid: [
      {
        title: "Workflows",
        subtitle: "Automate series of actions",
        link: "/concepts/workflows/",
        icon: "workflow-icon",
      },
      {
        title: "Steps",
        subtitle: "Perform pre-coded actions",
        link: "/concepts/steps/",
        icon: "step-icon",
      },
      {
        title: "Triggers",
        subtitle: "Control when workflows run",
        link: "/concepts/triggers/",
        icon: "trigger-icon",
      },
      {
        title: "Code",
        subtitle: "Run code in workflow steps",
        link: "/concepts/code/",
        icon: "code-icon",
      },
      {
        title: "Integrate",
        subtitle: "Connect apps together",
        link: "/concepts/integrate/",
        icon: "integration-icon",
      },
    ],
  },
  {
    text: "Guides",
    link: "/guides/",
  },
  {
    text: "Support",
    link: "/support/",
  },
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
];
