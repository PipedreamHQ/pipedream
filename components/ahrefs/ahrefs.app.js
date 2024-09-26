module.exports = {
  type: "app",
  app: "ahrefs",
  propDefinitions: {
    limit: {
      type: "integer",
      description: "Number of results to return.",
      default: 1000,
      optional: true,
    },
    mode: {
      type: "string",
      description: "Select a mode of operation (defaults to `Domain`).",
      options: [
        {
          label: "Exact",
          value: "exact",
        },
        {
          label: "Domain",
          value: "domain",
        },
        {
          label: "Subdomain",
          value: "subdomains",
        },
        {
          label: "Prefix",
          value: "prefix",
        },
      ],
      default: "domain",
      optional: true,
    },
    target: {
      type: "string",
      description: "Enter a domain or URL.",
    },
  },
};
