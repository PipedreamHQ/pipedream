import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gatherup",
  propDefinitions: {
    businessId: {
      label: "Business ID",
      description: "The business ID",
      type: "string",
      async options({ page }) {
        const { data: businesses } = await this.getBusinesses({
          params: {
            page: page + 1,
          },
        });

        return businesses.map((business) => ({
          label: business.businessName,
          value: business.businessId,
        }));
      },
    },
  },
  methods: {
    _bearerToken() {
      return this.$auth.bearer_token;
    },
    _clientId() {
      return this.$auth.client_id;
    },
    _apiUrl() {
      return "https://app.gatherup.com/api/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._bearerToken()}`,
        },
        ...args,
        params: {
          clientId: this._clientId(),
          ...args.params,
        },
      });
    },
    async getBusinesses(args = {}) {
      return this._makeRequest({
        path: "/businesses/get",
        ...args,
      });
    },
    async getFeedbacks(args = {}) {
      return this._makeRequest({
        path: "/feedbacks/get",
        ...args,
      });
    },
    async createCustomer(args = {}) {
      return this._makeRequest({
        path: "/customer/create",
        method: "post",
        ...args,
      });
    },
  },
};
