import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "outseta",
  propDefinitions: {
    billingStage: {
      type: "string",
      label: "Billing Stage",
      description: "The billing stage of the account",
      options: constants.ACCOUNT_BILLING_STAGE_OPTS,
    },
    personAccount: {
      type: "string",
      label: "Person Account",
      description: "The primary person associated with the account",
      async options({ prevContext }) {
        const { items } = await this.getAllPeople({
          $: this,
          page: prevContext?.nextPage || 0,
        });
        return {
          options: (items || []).map((item) => ({
            label: item.Email,
            value: item.Uid,
          })),
          context: {
            nextPage: (prevContext?.nextPage || 0) + 1,
          },
        };
      },
    },
  },
  methods: {
    _baseURL() {
      return `https://${this.$auth.domain}.outseta.com/api`;
    },
    _getHeaders(headers) {
      return {
        "Authorization": `Outseta ${this.$auth.api_key}:${this.$auth.api_secret}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      const config = {
        url: `${this._baseURL()}/${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      };
      return axios($, config);
    },
    addPerson({
      $,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/v1/crm/people",
        data,
      });
    },
    addAccount({
      $,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/v1/crm/accounts",
        data,
      });
    },
    getAllPeople({
      $,
      page = 0,
    }) {
      const limit = constants.GET_ALL_LIMIT;
      return this._makeRequest({
        $,
        path: "/v1/crm/people",
        params: {
          limit,
          offset: page,
        },
      });
    },
  },
};
