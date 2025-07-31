import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "sevdesk",
  propDefinitions: {
    addressCountryId: {
      type: "string",
      label: "Address Country ID",
      description: "Can be omitted as complete address is defined in address attribute.",
      async options() {
        const { objects } = await this.listCountries({
          params: {
            limit: 999,
          },
        });

        return objects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact for the invoice.",
      async options() {
        const { objects } = await this.listContacts();

        return objects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    invoiceId: {
      type: "integer",
      label: "Invoice Id",
      description: "ID of invoice to be manipulated.",
      async options() {
        const { objects } = await this.listInvoices();

        return objects.filter((item) => item.status != 1000).map(({
          id, header, invoiceNumber,
        }) => ({
          label: `${header || id} - ${invoiceNumber}`,
          value: parseInt(id),
        }));
      },
    },
    originId: {
      type: "string",
      label: "Origin Id",
      description: "The Id of the order.",
      async options() {
        const { objects } = await this.listOrders();

        return objects.map(({
          id: value, header, orderNumber,
        }) => ({
          label: `${header} - ${orderNumber}`,
          value,
        }));
      },
    },
    paymentMethodId: {
      type: "string",
      label: "Payment Method Id",
      description: "Payment method used for the invoice.",
      async options() {
        const { objects } = await this.listPaymentMethods();

        return objects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taxSetId: {
      type: "string",
      label: "Tax Set Id",
      description: "Tax set of the invoice. Needs to be added if you chose the tax type custom.",
      async options() {
        const { objects } = await this.listTaxSets();

        return objects.map(({
          id: value, displayText: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://my.sevdesk.de/api/v1";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.api_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...otherOpts,
      });
    },
    checkMe(opts = {}) {
      return this._makeRequest({
        path: "/SevUser",
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Invoice",
        ...opts,
      });
    },
    cancelInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/Invoice/${invoiceId}/cancelInvoice`,
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/Contact",
        ...opts,
      });
    },
    listCountries(opts = {}) {
      return this._makeRequest({
        path: "/StaticCountry",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/Invoice",
        ...opts,
      });
    },
    getInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `/Invoice/${invoiceId}`,
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/Order",
        ...opts,
      });
    },
    listVouchers(opts = {}) {
      return this._makeRequest({
        path: "/Voucher",
        ...opts,
      });
    },
    listPaymentMethods(opts = {}) {
      return this._makeRequest({
        path: "/PaymentMethod",
        ...opts,
      });
    },
    listTaxSets(opts = {}) {
      return this._makeRequest({
        path: "/TaxSet",
        ...opts,
      });
    },
    sendInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/Invoice/${invoiceId}/sendViaEmail`,
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
        params.limit = LIMIT;
        params.offset = LIMIT *  page;
        page++;

        const { objects } = await fn({
          params,
          ...opts,
        });
        for (const d of objects) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = objects.length;

      } while (hasMore);
    },
  },
};
