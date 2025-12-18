export default {
  type: "app",
  app: "http",
  propDefinitions: {
    /* eslint-disable-next-line pipedream/props-description */
    httpRequest: {
      type: "http_request",
      label: "HTTP Request Configuration",
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "An optional summary. This will be emitted as the `summary` metadata for the event. Example: `New item with ID: ${body.id}`",
      optional: true,
    },
  },
  methods: {
    interpolateSummary(summary, context) {
      if (typeof summary !== "string") {
        return "";
      }
      if (!context || typeof context !== "object") {
        return summary;
      }
      return summary.replace(/\$\{([^}]+)\}/g, (_, path) => {
        return path
          .trim()
          .split(".")
          .reduce((obj, key) => obj?.[key], context) ?? "";
      });
    }
    },
  },
};
