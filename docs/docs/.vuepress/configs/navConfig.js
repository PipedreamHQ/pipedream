module.exports = [
  {
    text: "Get Started",
    link: "/quickstart/",
    variant: 'primary',
  },
  {
    text: "Concepts",
    grid: [
      {
        title: "Workflows",
        subtitle: "Automate series of actions",
        link: "/workflows/",
        icon: "workflow-icon",
      },
      {
        title: "Steps",
        subtitle: "Perform pre-coded actions",
        link: "/workflows/steps/",
        icon: "step-icon",
      },
      {
        title: "Triggers",
        subtitle: "Control when workflows run",
        link: "/triggers/",
        icon: "trigger-icon",
      },
      {
        title: "Code",
        subtitle: "Run code in workflow steps",
        link: "/code/",
        icon: "code-icon",
      },
      {
        title: "Integrate",
        subtitle: "Connect apps together",
        link: "/integrate/",
        icon: "integration-icon",
      },
      {
        title: "Components",
        subtitle: "Build reusable sources and actions",
        link: "/components/",
        icon: "component-icon"
      }
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
    text: "Pricing",
    link: "/pricing/"
  },
  {
    text: "Security & Privacy",
    link: "/privacy-and-security/"
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
