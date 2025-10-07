export default {
  type: "app",
  app: "screenshotbase",
  name: "Screenshotbase",
  propDefinitions: {},
  auth: {
    type: "custom",
    fields: {
      api_key: {
        label: "API Key",
        description: "Get your key from the Screenshotbase dashboard.",
        type: "string",
      },
      base_url: {
        label: "Base URL (optional)",
        type: "string",
        optional: true,
        description: "Override API base, defaults to https://api.screenshotbase.com",
      },
    },
    test: {
      request: {
        url: "https://api.screenshotbase.com/status",
        headers: {
          apikey: "{{auth.api_key}}",
        },
      },
    },
    connectionLabel: "Screenshotbase",
  },
  methods: {
    baseUrl() {
      return this.$auth.base_url?.trim() || "https://api.screenshotbase.com";
    },
  },
};


