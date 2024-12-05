import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "botcake",
  propDefinitions: {
    flowId: {
      type: "integer",
      label: "Flow ID",
      description: "ID of the Flow",
      async options() {
        const response = await this.getFlow();
        const flowsIds = response.data.flows;
        return flowsIds.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    keywordId: {
      type: "integer",
      label: "Keyword ID",
      description: "ID of the Keyword",
      async options() {
        const response = await this.getKeyword();
        const keywordIds = response.data;
        return keywordIds.map(({ id }) => ({
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://botcake.io/api/public_api/v1/";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "access-token": `${this.$auth.api_key}`,
        },
      });
    },
    async createKeyword(args = {}) {
      return this._makeRequest({
        path: `/pages/${this.$auth.page_id}/keywords/create`,
        method: "post",
        ...args,
      });
    },
    async updateKeyword(args = {}) {
      return this._makeRequest({
        path: `/pages/${this.$auth.page_id}/keywords/update`,
        method: "post",
        ...args,
      });
    },
    async getTools(args = {}) {
      return this._makeRequest({
        path: `/pages/${this.$auth.page_id}/tools`,
        ...args,
      });
    },
    async getKeyword(args = {}) {
      return this._makeRequest({
        path: `/pages/${this.$auth.page_id}/keywords`,
        ...args,
      });
    },
    async getFlow(args = {}) {
      return this._makeRequest({
        path: `/pages/${this.$auth.page_id}/flows`,
        ...args,
      });
    },
  },
};
