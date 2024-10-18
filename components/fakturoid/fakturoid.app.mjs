import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fakturoid",
  propDefinitions: {
    accountSlug: {
      type: "string",
      label: "Account",
      description: "The account you want to use",
      async options() {
        const { accounts } = await this.getLoggedUser();

        return accounts.map(({
          slug: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    subjectId: {
      type: "string",
      label: "Subject Id",
      description: "The id of the subject",
      async options({
        page, accountSlug,
      }) {
        const data = await this.listSubjects({
          accountSlug,
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name, full_name: fName,
        }) => ({
          label: fName || name,
          value,
        }));
      },
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "Unique identifier for the invoice",
      async options({
        page, accountSlug,
      }) {
        const data = await this.listInvoices({
          accountSlug,
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, client_name: cName, due_on: due, currency, total,
        }) => ({
          label: `${cName} - ${currency} ${total} - Due On: ${due}`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl(accountSlug) {
      return `https://app.fakturoid.cz/api/v3${accountSlug
        ? `/accounts/${accountSlug}`
        : ""}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, accountSlug, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(accountSlug) + path,
        headers: this._headers(),
        ...opts,
      });
    },
    getLoggedUser() {
      return this._makeRequest({
        path: "/user.json",
      });
    },
    getInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `/invoices/${invoiceId}.json`,
        ...opts,
      });
    },
    listSubjects(opts = {}) {
      return this._makeRequest({
        path: "/subjects.json",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices.json",
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices.json",
        ...opts,
      });
    },
    fireInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/invoices/${invoiceId}/fire.json`,
        ...opts,
      });
    },
    payInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/invoices/${invoiceId}/payments.json`,
        ...opts,
      });
    },
    removePayment({
      invoiceId, paymentId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/invoices/${invoiceId}/payments/${paymentId}.json`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, ...opts
    }) {
      let hasMore = false;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
