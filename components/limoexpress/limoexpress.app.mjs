import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "limoexpress",
  propDefinitions: {
    bookingTypeId: {
      type: "string",
      label: "Booking Type ID",
      description: "ID of the booking type.",
      async options() {
        const { data } = await this.listBookingTypes();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    bookingStatusId: {
      type: "string",
      label: "Booking Status ID",
      description: "ID of the booking status.",
      async options() {
        const { data } = await this.listBookingStatuses();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    vehicleClassId: {
      type: "string",
      label: "Vehicle Class ID",
      description: "ID of the vehicle class to be used for the booking.",
      async options({ page }) {
        const { data } = await this.listVehicleClasses({
          params: {
            page,
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
    vehicleId: {
      type: "string",
      label: "Vehicle ID",
      description: "ID of the vehicle to be used for the booking. **Vehicle class ID is required**.",
      async options({
        page, vehicleClassId,
      }) {
        const { data } = await this.listVehicles({
          params: {
            page,
            search_string: vehicleClassId,
          },
        });
        return data.map(({
          id: value, name, plate_number,
        }) => ({
          label: `${name} (${plate_number})`,
          value,
        }));
      },
    },
    currencyId: {
      type: "string",
      label: "Currency ID",
      description: "ID of the currency to be used for the booking.",
      async options() {
        const { data } = await this.listCurrencies();
        return data.map(({
          id: value, code: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    paymentMethodId: {
      type: "string",
      label: "Payment Method ID",
      description: "ID of the payment method for the booking.",
      async options({ page }) {
        const { data } = await this.listPaymentMethods({
          params: {
            page,
          },
        });
        return data.filter(({ hidden }) => !hidden).map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "ID of the client for the booking.",
      async options({ page }) {
        const { data } = await this.listClients({
          params: {
            page,
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
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice.",
      async options({ page }) {
        const { data } = await this.listInvoices({
          params: {
            page,
          },
        });
        return data.map(({
          id: value, number: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.limoexpress.me/api/integration";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "*/*",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listBookings(opts = {}) {
      return this._makeRequest({
        path: "/bookings",
        ...opts,
      });
    },
    listBookingTypes(opts = {}) {
      return this._makeRequest({
        path: "/booking-types",
        ...opts,
      });
    },
    listBookingStatuses(opts = {}) {
      return this._makeRequest({
        path: "/booking-statuses",
        ...opts,
      });
    },
    listVehicleClasses(opts = {}) {
      return this._makeRequest({
        path: "/vehicle-classes",
        ...opts,
      });
    },
    listVehicles(opts = {}) {
      return this._makeRequest({
        path: "/vehicles",
        ...opts,
      });
    },
    listCurrencies(opts = {}) {
      return this._makeRequest({
        path: "/currencies",
        ...opts,
      });
    },
    listPaymentMethods(opts = {}) {
      return this._makeRequest({
        path: "/payment-methods",
        ...opts,
      });
    },
    listClients(opts = {}) {
      return this._makeRequest({
        path: "/clients",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    createBooking(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/bookings",
        ...opts,
      });
    },
    createClient(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/clients",
        ...opts,
      });
    },
    markInvoiceAsPaid({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/invoices/${invoiceId}/mark_as_paid`,
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
        params.per_page = 100;
        const {
          data,
          meta: {
            current_page, last_page,
          },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = !(current_page == last_page);

      } while (hasMore);
    },
  },
};
