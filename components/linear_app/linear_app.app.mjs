import { LinearClient } from "@linear/sdk";

export default {
  type: "app",
  app: "linear_app",
  propDefinitions: {
    commonProperty: {
      type: "string",
      label: "Common property",
      description: "[See the docs here](https://example.com)",
    },
  },
  methods: {
    client({ options } = {}) {
      return new LinearClient({
        apiKey: this.$auth.api_key,
        ...options,
      });
    },
    async createWebhook(input) {
      return this.client().webhookCreate(input);
    },
    async deleteWebhook(id) {
      return this.client().webhookDelete(id);
    },
  },
};
