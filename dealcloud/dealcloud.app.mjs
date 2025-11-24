import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dealcloud",
  propDefinitions: {},
  methods: {
    async _makeRequest({
      $ = this, headers, ...args
    }) {
      const response = await axios($, {
        baseURL: `${this.$auth.host_url}/api/rest/v4/`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
      return response.data;
    },
    async getEntryTypeFields({
      entryTypeId, ...args
    }) {
      return this._makeRequest({
        url: `/schema/entrytypes/${entryTypeId}/fields`,
        ...args,
      });
    },
  },
};
