export default {
  type: "app",
  app: "obolus",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Optional public API key for Obolus",
      secret: true,
      optional: true,
    },
  },
};
