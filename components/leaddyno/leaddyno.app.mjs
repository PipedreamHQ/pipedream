import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "leaddyno",
  propDefinitions: {
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The ID of the lead to retrieve",
      async options({ page }) {
        const data = await this.listLeads({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    leadEmail: {
      type: "string",
      label: "Lead Email",
      description: "The email of the customer",
      async options({ page }) {
        const data = await this.listLeads({
          params: {
            page: page + 1,
          },
        });

        return data.map(({ email }) => email);
      },
    },
    affiliate: {
      type: "string",
      label: "Affiliate",
      description: "The affiliate which the lead belongs to",
      async options({ page }) {
        const data = await this.listAffiliates({
          params: {
            page: page + 1,
          },
        });
        return data.map(({ email }) => email);
      },
    },
    affiliateCode: {
      type: "string",
      label: "Affiliate Code",
      description: "The affiliate code to which the purchase should be assigned. Its usage depends on the 'first source wins' or 'first affiliate wins' settings",
      async options({ page }) {
        const data = await this.listAffiliates({
          params: {
            page: page + 1,
          },
        });
        return data.map((item) => ({
          label: `${item.first_name} ${item.last_name} (${item.email})`,
          value: item.affiliate_code,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.leaddyno.com/v1";
    },
    _params(params = {}) {
      return {
        key: `${this.$auth.api_key}`,
        ...params,
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        ...opts,
      });
    },
    getLead({
      leadId, ...opts
    }) {
      return this._makeRequest({
        path: `/leads/${leadId}`,
        ...opts,
      });
    },
    listAffiliates(opts = {}) {
      return this._makeRequest({
        path: "/affiliates",
        ...opts,
      });
    },
    createAffiliate(opts = {}) {
      return this._makeRequest({
        path: "/affiliates",
        method: "POST",
        ...opts,
      });
    },
    createPurchase(opts = {}) {
      return this._makeRequest({
        path: "/purchases",
        method: "POST",
        ...opts,
      });
    },
    listPurchases(opts = {}) {
      return this._makeRequest({
        path: "/purchases",
        ...opts,
      });
    },
    createLead(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        method: "POST",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
