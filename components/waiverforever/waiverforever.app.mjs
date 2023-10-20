import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "waiverforever",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Request name",
    },
    size: {
      type: "integer",
      label: "Size",
      min: 0,
      max: 1000,
      description: "Request size. Between 0 and 1000",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Request note",
    },
    type: {
      type: "string",
      label: "Name",
      description: "Request name",
      options: [
        "normal",
        "anonymous",
      ],
    },
    contactInfo: {
      type: "string",
      label: "Contact Info",
      description: "Request contact info",
    },
    template: {
      type: "string",
      label: "Template",
      description: "Request template id",
      async options({ page }) {
        const templates = await this.listTemplates({
          page: page + 1,
        });

        return templates.map(({
          title: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    accessToken() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.waiverforever.com/openapi";
    },
    _getHeaders() {
      return {
        "X-API-Key": this.accessToken(),
      };
    },
    async _makeRequest({
      $ = this, path, ...options
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...options,
      };
      return axios($, config);
    },
    async createHook(data) {
      return (await this._makeRequest({
        method: "POST",
        path: "v1/webhooks/",
        data,
      })).data;
    },
    async deleteHook(id) {
      return await this._makeRequest({
        method: "DELETE",
        path: `v1/webhooks/${id}/`,
      });
    },
    async listTemplates(params) {
      return (await this._makeRequest({
        method: "GET",
        path: "v1/templates",
        params,
      })).data;
    },
    async createWaiverRequest(data) {
      return await this._makeRequest({
        method: "POST",
        path: "v2/waiverRequest",
        data,
      });
    },
  },
};
