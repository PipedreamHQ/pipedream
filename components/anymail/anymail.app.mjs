import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "anymail",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign",
      description: "A draft or active campaign.",
      async options({ prevContext }) {
        const {
          data, next_cursor: cursor,
        } = await this.listCampaigns({
          params: {
            limit: 100,
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: data.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
          context: {
            cursor,
          },
        };
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the prospect.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.anymail.watch/api/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          "User-Agent": "anymail-pipedream/0.0.1",
        },
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    async findProspectByEmail({
      email, ...opts
    }) {
      const { data } = await this._makeRequest({
        path: "/prospects",
        params: {
          email,
        },
        ...opts,
      });
      return data[0];
    },
    getProspect({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/prospects/${id}`,
        ...opts,
      });
    },
    createProspect(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/prospects",
        ...opts,
      });
    },
    updateProspect({
      id, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/prospects/${id}`,
        ...opts,
      });
    },
    addProspectsToCampaign({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/campaigns/${campaignId}/prospects`,
        ...opts,
      });
    },
    createSuppression(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/suppressions",
        ...opts,
      });
    },
    listHookSamples(opts = {}) {
      return this._makeRequest({
        path: "/hooks/samples",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks",
        ...opts,
      });
    },
    deleteHook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${id}`,
      });
    },
  },
};
