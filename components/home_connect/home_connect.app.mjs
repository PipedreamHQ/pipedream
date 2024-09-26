import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "home_connect",
  propDefinitions: {
    haId: {
      type: "string",
      label: "Home Appliance ID",
      description: "The unique identifier of the home appliance.",
      async options() {
        const { data: { homeappliances: resources } } = await this.getAppliances();

        return resources.map(({
          haId, name,
        }) => ({
          value: haId,
          label: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.host_environment}/api`;
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getAppliances(args = {}) {
      return this._makeRequest({
        path: "/homeappliances",
        ...args,
      });
    },
    async getApplianceStatus({
      haId, ...args
    }) {
      return this._makeRequest({
        path: `/homeappliances/${haId}/status`,
        ...args,
      });
    },
    async getAvailablePrograms({
      haId, ...args
    }) {
      return this._makeRequest({
        path: `/homeappliances/${haId}/programs/available`,
        ...args,
      });
    },
  },
};
