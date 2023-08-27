import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";
import qs from "qs";

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
    person: {
      type: "string",
      label: "Person",
      description: "The person to be associated",
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
    account: {
      type: "string",
      label: "Account",
      description: "The account to be associated",
      async options({ prevContext }) {
        const { items } = await this.getAllAccounts({
          $: this,
          page: prevContext?.nextPage || 0,
        });
        return {
          options: (items || []).map((item) => ({
            label: item.Name,
            value: item.Uid,
          })),
          context: {
            nextPage: (prevContext?.nextPage || 0) + 1,
          },
        };
      },
    },
    dealPipelineStage: {
      type: "string",
      label: "Deal Pipeline Stage",
      description: "The pipeline stage of the deal",
      async options({ prevContext }) {
        const { items } = await this.getAllDealPipelines({
          $: this,
          page: prevContext?.nextPage || 0,
        });
        return {
          options: (items || []).map((item) => item.DealPipelineStages.map((stage) => ({
            label: `${item.Name} - ${stage.Name}`,
            value: stage.Uid,
          }))).flat(),
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
        paramsSerializer: (params) => qs.stringify(params, {
          encode: false,
        }),
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
    addDeal({
      $,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/v1/crm/deals",
        data,
      });
    },
    getAllPeople({
      $,
      page = 0,
      limit = constants.GET_ALL_LIMIT,
      params = {},
    }) {
      return this._makeRequest({
        $,
        path: "/v1/crm/people",
        params: {
          limit,
          offset: page,
          ...params,
        },
      });
    },
    getAllAccounts({
      $,
      page = 0,
      limit = constants.GET_ALL_LIMIT,
      params = {},
    }) {
      return this._makeRequest({
        $,
        path: "/v1/crm/accounts",
        params: {
          limit,
          offset: page,
          ...params,
        },
      });
    },
    getAllDeals({
      $,
      page = 0,
      limit = constants.GET_ALL_LIMIT,
      params = {},
    }) {
      return this._makeRequest({
        $,
        path: "/v1/crm/deals",
        params: {
          limit,
          offset: page,
          ...params,
        },
      });
    },
    getAllDealPipelines({
      $,
      page = 0,
      limit = constants.GET_ALL_LIMIT,
      params = {},
    }) {
      return this._makeRequest({
        $,
        path: "/v1/crm/dealpipelines",
        params: {
          limit,
          offset: page,
          ...params,
        },
      });
    },
  },
};
