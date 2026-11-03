import {
  axios, ConfigurationError,
} from "@pipedream/platform";

// The API returns lists oldest first, 100 to a page
const PER_PAGE = 100;

export default {
  type: "app",
  app: "dpd2",
  propDefinitions: {
    storefrontId: {
      type: "string",
      label: "Store",
      description: "One of your DPD stores",
      optional: true,
      async options({ page = 0 } = {}) {
        // The API returns the whole list at once
        if (page) {
          return [];
        }
        const storefronts = await this.listStorefronts();
        return storefronts?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    subscriptionStorefrontId: {
      type: "string",
      label: "Subscription Store",
      description: "One of your DPD subscription (membership) stores",
      async options({ page = 0 } = {}) {
        // The API returns the whole list at once
        if (page) {
          return [];
        }
        const storefronts = await this.listStorefronts();
        return storefronts?.filter(({ type }) => type === "subscription")
          .map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })) || [];
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of a product",
      optional: true,
      async options({
        storefrontId, page = 0,
      } = {}) {
        // The API returns the whole list at once
        if (page) {
          return [];
        }
        const products = await this.listProducts({
          params: {
            storefront_id: storefrontId,
          },
        });
        return products?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of a customer",
      optional: true,
      async options({ page = 0 } = {}) {
        const customers = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });
        return customers?.map(({
          id: value, first_name: firstName, last_name: lastName, email,
        }) => ({
          label: [
            firstName,
            lastName,
          ].filter(Boolean).join(" ") || email,
          value,
        })) || [];
      },
    },
    purchaseId: {
      type: "string",
      label: "Purchase ID",
      description: "The ID of a purchase. The list shows the last 90 days' purchases, newest first.",
      async options({ page = 0 } = {}) {
        // One list of the last 90 days, read in full
        if (page) {
          return [];
        }
        const purchases = await this.listAll({
          fn: this.listPurchases,
          params: {
            date_min: this.toIsoDate(Date.now() / 1000 - 90 * 86400),
          },
          maxPages: 5,
        });
        return this.newestFirst(purchases).map((p) => ({
          label: [
            `#${p.id}`,
            [
              p.buyer_firstname,
              p.buyer_lastname,
            ].filter(Boolean).join(" ") || p.buyer_email,
            `${p.total} ${p.currency}`,
            this.toIsoDate(p.created_at).slice(0, 10),
          ].join(" · "),
          value: p.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getdpd.com/v2";
    },
    _auth() {
      return {
        username: this.$auth.api_username,
        password: this.$auth.api_password,
      };
    },
    /**
     * A request to the DPD API
     * @params {Object} opts - `path`, plus any axios config
     * @returns {Promise<*>} The response's data, or null for a 404, which DPD
     * returns both for a missing record and for an empty list or search
     */
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      try {
        // A 404 isn't treated as an error, so empty lists don't log one
        const response = await axios($, {
          ...opts,
          url: `${this._baseUrl()}${path}`,
          auth: this._auth(),
          returnFullResponse: true,
          validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
        });
        return response.status === 404
          ? null
          : response.data;
      } catch (err) {
        if (err.response?.status === 401) {
          throw new ConfigurationError("DPD didn't accept that username and API key. They're under API credentials on your DPD profile page.");
        }
        throw err;
      }
    },
    listStorefronts(opts = {}) {
      return this._makeRequest({
        path: "/storefronts",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    listPurchases(opts = {}) {
      return this._makeRequest({
        path: "/purchases",
        ...opts,
      });
    },
    getPurchase({
      purchaseId, ...opts
    }) {
      return this._makeRequest({
        path: `/purchases/${encodeURIComponent(purchaseId)}`,
        ...opts,
      });
    },
    reactivatePurchase({
      purchaseId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/purchases/${encodeURIComponent(purchaseId)}/reactivate`,
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listSubscribers({
      storefrontId, ...opts
    }) {
      return this._makeRequest({
        path: `/storefronts/${encodeURIComponent(storefrontId)}/subscribers`,
        ...opts,
      });
    },
    /**
     * Every page of a paged list (purchases or customers), oldest first
     * @params {Object} opts
     * @params {Function} opts.fn - `listPurchases` or `listCustomers`
     * @params {Object} [opts.params={}] - The API's filters
     * @params {number} [opts.maxPages=10] - Stop after this many pages of 100
     * @returns {Promise<Object[]>}
     */
    async listAll({
      fn, params = {}, maxPages = 10, ...opts
    }) {
      const records = [];
      for (let page = 1; page <= maxPages; page++) {
        const batch = await fn.call(this, {
          ...opts,
          params: {
            ...params,
            page,
          },
        });
        if (!Array.isArray(batch) || !batch.length) {
          break;
        }
        records.push(...batch);
        if (batch.length < PER_PAGE) {
          break;
        }
      }
      return records;
    },
    /**
     * Records newest first. The API can't sort.
     * @params {Object[]} records
     * @returns {Object[]}
     */
    newestFirst(records) {
      return [
        ...records,
      ].sort((a, b) => Number(b.created_at) - Number(a.created_at) || b.id - a.id);
    },
    /**
     * An ISO 8601 date and time from one of the API's UNIX timestamps. The
     * `date_min` filters need this: they don't accept UNIX timestamps.
     * @params {number|string} timestamp - Seconds
     * @returns {string}
     */
    toIsoDate(timestamp) {
      return new Date(Number(timestamp) * 1000).toISOString();
    },
    /**
     * Whether two email addresses match. The API's email filters match the
     * start of an address, so searches keep only exact matches.
     * @returns {boolean}
     */
    sameEmail(a, b) {
      return String(a || "").trim()
        .toLowerCase() === String(b || "").trim()
        .toLowerCase();
    },
  },
};
