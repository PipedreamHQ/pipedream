import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "loop_returns",
  propDefinitions: {
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The ID of the return",
      async options({ prevContext }) {
        const {
          returns, nextPageUrl,
        } = await this.listReturns({
          prevContext,
        });
        const options = returns.map((r) => ({
          label: `Return #${r.id}`,
          value: r.id.toString(),
        }));
        return {
          options,
          context: nextPageUrl
            ? {
              nextPageUrl,
            }
            : {},
        };
      },
    },
    labelId: {
      type: "string",
      label: "Label ID",
      description: "The ID of the label to monitor for updates",
      async options() {
        // Since the API docs do not provide an endpoint for fetching labels,
        // we will assume that the user has to input the Label ID manually.
        // If an endpoint becomes available, this method should be updated to fetch labels.
        return [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.loopreturns.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listReturns({ prevContext }) {
      const path = prevContext && prevContext.nextPageUrl
        ? prevContext.nextPageUrl
        : "/warehouse/return/list?paginate=true&pageSize=50";
      return this._makeRequest({
        path,
      });
    },
    async flagReturn({ returnId }) {
      return this._makeRequest({
        method: "POST",
        path: `/warehouse/return/${returnId}/flag`,
      });
    },
    async cancelReturn({ returnId }) {
      return this._makeRequest({
        method: "POST",
        path: `/warehouse/return/${returnId}/cancel`,
      });
    },
    async processReturn({ returnId }) {
      return this._makeRequest({
        method: "POST",
        path: `/warehouse/return/${returnId}/process`,
      });
    },
  },
};
