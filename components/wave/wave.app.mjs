import { axios } from "@pipedream/platform";
import { LIST_BUSINESS_QUERY } from "./common/queries.mjs";
import { CREATE_CUSTOMER_MUTATION } from "./common/mutations.mjs";

export default {
  type: "app",
  app: "wave",
  propDefinitions: {
    businessId: {
      type: "string",
      label: "Business",
      description: "The business.",
      async options({ page }) {
        const res = await this.listBusiness(page + 1);

        return res.data.businesses.edges.map((edge) => {
          const {
            id,
            name,
          } = edge.node;
          return {
            label: name,
            value: id,
          };
        });
      },
    },
  },
  methods: {
    _getBaseURL() {
      return "https://gql.waveapps.com/graphql/public";
    },
    _getAuthorizationHeader() {
      return `Bearer ${this.$auth.oauth_access_token}`;
    },
    _getHeaders() {
      return {
        Authorization: this._getAuthorizationHeader(),
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        method: "POST",
        url: this._getBaseURL(),
        headers: {
          ...this._getHeaders(),
          ...opts.headers,
        },
      };

      return axios(ctx, axiosOpts);
    },
    async listBusiness(page) {
      const PAGE_SIZE = 100;
      return this._makeHttpRequest({
        data: {
          query: LIST_BUSINESS_QUERY,
          variables: {
            page,
            pageSize: PAGE_SIZE,
          },
        },
      });
    },
    async createCustomer(input) {
      return this._makeHttpRequest({
        data: {
          query: CREATE_CUSTOMER_MUTATION,
          variables: {
            input,
          },
        },
      });
    },
  },
};
