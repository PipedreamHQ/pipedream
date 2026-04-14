import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "billsby",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
      useQuery: true,
      async options({
        page, query,
      }) {
        const { results } = await this.listCustomers({
          params: {
            page: page + 1,
            pageSize: 50,
            search: query,
          },
        });
        return results?.map(({
          customerUniqueId: value, firstName, lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value,
        })) || [];
      },
    },
    subscriptionIds: {
      type: "string[]",
      label: "Subscription IDs",
      description: "The IDs of the subscriptions",
      async options({ page }) {
        const { results } = await this.listSubscriptions({
          params: {
            page: page + 1,
            pageSize: 50,
          },
        });
        return results?.map(({
          subscriptionUniqueId: value, customerFullname, productName,
        }) => ({
          label: `${customerFullname} - ${productName}`,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://public.billsby.com/api/v1/rest/core/${this.$auth.company_domain}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ApiKey: this.$auth.api_key,
        },
        ...opts,
      });
    },
    getCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listSubscriptions(opts = {}) {
      return this._makeRequest({
        path: "/subscriptions",
        ...opts,
      });
    },
    listCompanyInvoices(opts = {}) {
      return this._makeRequest({
        path: "/companies/invoices",
        ...opts,
      });
    },
    createOneTimeCharge({
      customerId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/customers/${customerId}/invoices`,
        ...opts,
      });
    },
    updateCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
    addFeatureTags(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriptions/tags",
        ...opts,
      });
    },
    async *paginate({
      fn, params, max,
    }) {
      params = {
        ...params,
        page: 1,
        pageSize: 100,
      };
      let total, count = 0;
      do {
        const { results } = await fn({
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
        total = results.length;
        params.page++;
      } while (total === params.pageSize);
    },
  },
};
