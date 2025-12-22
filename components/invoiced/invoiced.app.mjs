import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "invoiced",
  propDefinitions: {
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The ID of the member",
      async options({ page }) {
        const data = await this.listMembers({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, user: {
            first_name: fName, last_name: lName, email,
          },
        }) => ({
          label: `${fName} ${lName} (${email})`,
          value,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
      async options({ page }) {
        const data = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, name, email,
        }) => ({
          label: `${name} ${email
            ? `(${email})`
            : ""}`,
          value,
        }));
      },
    },
    chasingCadenceId: {
      type: "integer",
      label: "Chasing Cadence",
      description: "The ID of the chasing cadence",
      async options({ page }) {
        const data = await this.listChasingCadences({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    nextChaseStep: {
      type: "integer",
      label: "Next Chase Step",
      description: "Cadence step ID",
      async options({ chasingCadence }) {
        const { steps } = await this.getChasingCadence({
          chasingCadence,
        });
        return steps.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taxId: {
      type: "string",
      label: "Tax ID",
      description: "Tax ID to be displayed on documents",
      async options({ page }) {
        const data = await this.listTaxRates({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    couponId: {
      type: "string",
      label: "Coupon ID",
      description: "The ID of the coupon",
      async options({ page }) {
        const data = await this.listCoupons({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "A hash of key/value pairs that can store additional information about this object.",
      optional: true,
    },
    paymentMethodId: {
      type: "string[]",
      label: "Disabled Payment Methods",
      description: "Array of payment method IDs to disable for the customer. i.e., [\"wire_transfer\", \"credit_card\"]",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.sandbox.invoiced.com";
      // return "https://api.invoiced.com";
    },
    _getAuth() {
      return {
        username: this.$auth.api_key,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._getBaseUrl()}${path}`,
        auth: this._getAuth(),
        ...args,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        method: "POST",
        ...opts,
      });
    },
    createPayment(opts = {}) {
      return this._makeRequest({
        path: "/payments",
        method: "POST",
        ...opts,
      });
    },
    listMembers(opts = {}) {
      return this._makeRequest({
        path: "/members",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    listCoupons(opts = {}) {
      return this._makeRequest({
        path: "/coupons",
        ...opts,
      });
    },
    listTaxRates(opts = {}) {
      return this._makeRequest({
        path: "/tax_rates",
        ...opts,
      });
    },
    listChasingCadences(opts = {}) {
      return this._makeRequest({
        path: "/chasing_cadences",
        ...opts,
      });
    },
    getChasingCadence({ chasingCadence }) {
      return this._makeRequest({
        path: `/chasing_cadences/${chasingCadence}`,
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
