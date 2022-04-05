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
      text: "Reference",
      items: [
        { text: "Building Components", link: "/components/" },
        { text: "CLI", link: "/cli/" },
        { text: "REST API", link: "/api/" },
        { text: "Limits", link: "/limits/" },
        { text: "Security & Privacy", link: "/privacy-and-security/"}
      ],
    },
  ], 
  right: [
    {
      text: "Support",
      link: "/support/",
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
  ]
};
