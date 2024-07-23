import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendspark",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the dynamic video campaign",
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace where the dynamic video campaign will be created",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sendspark.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createDynamicVideoCampaign({
      workspaceId, name,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/dynamics`,
        data: {
          name,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
