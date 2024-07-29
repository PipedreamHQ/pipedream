import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendspark",
  propDefinitions: {
    dynamicId: {
      type: "string",
      label: "Dynamic Campaign ID",
      description: "The ID of the dynamic campaign.",
      async options() {
        const { response: { data } } = await this.listDynamicCampaigns();

        return data.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/v1/workspaces/${this.$auth.workspace_id}`;
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
        "x-api-secret": `${this.$auth.api_secret_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listDynamicCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/dynamics",
        ...opts,
      });
    },
    createDynamicVideoCampaign({
      dynamicId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/dynamics/${dynamicId}/prospect`,
        ...opts,
      });
    },
  },
};
