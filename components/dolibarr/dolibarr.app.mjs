import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "dolibarr",
  propDefinitions: {
    thirdPartyId: {
      type: "string",
      label: "Third Party ID",
      description: "The ID of the third party or customer",
      async options({ page }) {
        const response = await this.listThirdParties({
          params: {
            limit: DEFAULT_LIMIT,
            page,
          },
        });
        return response?.map((item) => ({
          label: item.name,
          value: item.id,
        })) || [];
      },
    },
    paymentTermCode: {
      type: "string",
      label: "Payment Term ID",
      description: "The ID of the payment term",
      optional: true,
      async options({ page }) {
        const response = await this.listPaymentTerms({
          params: {
            limit: DEFAULT_LIMIT,
            page,
          },
        });
        return response?.map((item) => ({
          label: item.label,
          value: item.code,
        })) || [];
      },
    },
    paymentMethodCode: {
      type: "string",
      label: "Payment Method Code",
      description: "The code of the payment method",
      optional: true,
      async options({ page }) {
        const response = await this.listPaymentMethods({
          params: {
            limit: DEFAULT_LIMIT,
            page,
          },
        });
        return response?.map((item) => ({
          label: item.label,
          value: item.code,
        })) || [];
      },
    },
    additionalProperties: {
      type: "object",
      label: "Additional Properties",
      description: "Additional properties to add",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}/api/index.php`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios ($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          dolapikey: this.$auth.api_key,
        },
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    listThirdParties(opts = {}) {
      return this._makeRequest({
        path: "/thirdparties",
        ...opts,
      });
    },
    listPaymentTerms(opts = {}) {
      return this._makeRequest({
        path: "/setup/dictionary/payment_terms",
        ...opts,
      });
    },
    listPaymentMethods(opts = {}) {
      return this._makeRequest({
        path: "/setup/dictionary/payment_types",
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        ...opts,
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        ...opts,
      });
    },
    createThirdParty(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/thirdparties",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, max,
    }) {
      params = {
        ...params,
        limit: 100,
        page: 0,
      };
      let total, count = 0;
      do {
        const results = await fn({
          params,
        });
        if (!results?.length) {
          return;
        }
        for (const item of results) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        params.page++;
        total = results?.length;
      } while (total === params.limit);
    },
  },
};
