import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "home_connect",
  propDefinitions: {
    haId: {
      type: "string",
      label: "Home Appliance ID",
      description: "The unique identifier of the home appliance.",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const { data } = await this.getPairedAppliances({
          params: {
            page,
          },
        });
        return {
          options: data.homeappliances.map((appliance) => ({
            label: `${appliance.brand} ${appliance.name} (${appliance.haId})`,
            value: appliance.haId,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.home-connect.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getPairedAppliances(opts = {}) {
      return this._makeRequest({
        path: "/homeappliances",
        ...opts,
      });
    },
    async getApplianceStatus(haId) {
      return this._makeRequest({
        path: `/homeappliances/${haId}/status`,
      });
    },
    async getAvailablePrograms(haId) {
      return this._makeRequest({
        path: `/homeappliances/${haId}/programs/available`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
