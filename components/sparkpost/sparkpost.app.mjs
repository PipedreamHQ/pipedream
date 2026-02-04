import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sparkpost",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to send",
      async options() {
        const { results } = await this.listTemplates();
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.sparkpost.com/api/v1`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    sendTransmission(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transmissions",
        ...opts,
      });
    },
  },
};
