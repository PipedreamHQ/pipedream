module.exports = {
  left: [
    {
      text: "Documentation",
      link: "/",
    },
    {
      text: "Quickstart",
      link: "/quickstart/",
      variant: "primary",
    },
    {
      text: "Guides",
      link: "/guides/",
    },
    {
      text: "Reference",
      items: [
        { text: "Building Components", link: "/components/" },
        { text: "CLI", link: "/cli/install/" },
        { text: "REST API", link: "/api/" },
        { text: "Limits", link: "/limits/" },
        { text: "Security & Privacy", link: "/privacy-and-security/"},
        { text: "Handling Cold Starts", link: "/workflows/events/cold-starts/"},
      ],
    },
  ], 
  right: [
    {
      text: "Support",
      link: "https://pipedream.com/support",
      internal: true,
    },
    {
      text: "Pricing",
      link: "/pricing/",
    },
    {
      text: "v2",
      className: "docs-version",
      ariaLabel: "Docs Version Menu",
      items: [
        {
          text: "v2",
          link: "https://pipedream.com/docs",
          internal: true,
          badge: "New",
          badgeVariation: "primary",
        },
        {
          text: "v1",
          internal: true,
          link: "https://pipedream.com/docs/v1",
        },
      ],
    },
  ]
};
