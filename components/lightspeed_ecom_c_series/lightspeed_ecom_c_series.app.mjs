import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lightspeed_ecom_c_series",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Retrieve all orders from a specific customer based on the customerid",
      async options({ page }) {
        const { customers } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });

        return customers.map(({
          id: value, firstname, middlename, lastname, email,
        }) => ({
          label: `${firstname} ${middlename && `${middlename} ` || ""}${lastname} ${email && `(${email})` || ""}`,
          value,
        }));
      },
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "Retrieve all customers from a specific customer based on the customer email",
      async options({ page }) {
        const { customers } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });

        return customers.map(({
          email: value, firstname, middlename, lastname,
        }) => ({
          label: `${firstname} ${middlename && `${middlename} ` || ""}${lastname} ${value && `(${value})` || ""}`,
          value,
        }));
      },
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "Retrieve an order based on the order number",
      async options({ page }) {
        const { orders } = await this.listOrder({
          params: {
            page: page + 1,
          },
        });

        return orders.map(({
          number, email,
        }) => ({
          label: `Order #${number} ${email && `(${email})`}`,
          value: number,
        }));
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "Retrieve an order based on the order ID",
      async options({ page }) {
        const { orders } = await this.listOrder({
          params: {
            page: page + 1,
          },
        });

        return orders.map(({
          id: value, number, email,
        }) => ({
          label: `Order #${number} ${email && `(${email})`}`,
          value: value,
        }));
      },
    },
    shipmentNumber: {
      type: "string",
      label: "Shipment Number",
      description: "Retrieve a shipment based on the shipment number",
      async options({ page }) {
        const { shipments } = await this.listShipment({
          params: {
            page: page + 1,
          },
        });

        return shipments.map(({
          number, status,
        }) => ({
          label: `Shipment #${number} ${status && `(${status})`}`,
          value: number,
        }));
      },
    },
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "Retrieve a shipment based on the shipment ID",
      async options({ page }) {
        const { shipments } = await this.listShipment({
          params: {
            page: page + 1,
          },
        });

        return shipments.map(({
          id: value, number, status,
        }) => ({
          label: `Shipment #${number} ${status && `(${status})`}`,
          value: value,
        }));
      },
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "Retrieve an invoice based on the invoice number",
      async options({ page }) {
        const { invoices } = await this.listInvoice({
          params: {
            page: page + 1,
          },
        });

        return invoices.map(({
          number, status,
        }) => ({
          label: `Invoice #${number} ${status && `(${status})`}`,
          value: number,
        }));
      },
    },
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "Retrieve a product based on the brand ID",
      async options({ page }) {
        const { brands } = await this.listBrands({
          params: {
            page,
          },
        });

        return brands.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "Retrieve a product based on the product ID",
      async options({ page }) {
        const { products } = await this.listProduct({
          params: {
            page: page + 1,
          },
        });

        return products.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    createdAtMin: {
      type: "string",
      label: "Created At Min",
      description: "Show products created after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
      optional: true,
    },
    createdAtMax: {
      type: "string",
      label: "Created At Max",
      description: "Show products created before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
      optional: true,
    },
    updatedAtMin: {
      type: "string",
      label: "Updated At Min",
      description: "Show products last updated after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
      optional: true,
    },
    updatedAtMax: {
      type: "string",
      label: "Updated At Max",
      description: "Show products last updated before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.${this.$auth.cluster}.com/${this.$auth.lang}`;
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: `${this.$auth.api_secret}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers.json",
        ...opts,
      });
    },
    listShipment(opts = {}) {
      return this._makeRequest({
        path: "/shipments.json",
        ...opts,
      });
    },
    listOrder(opts = {}) {
      return this._makeRequest({
        path: "/orders.json",
        ...opts,
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}.json`,
        ...opts,
      });
    },
    getOrderProducts({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}/products.json`,
        ...opts,
      });
    },
    getShipment({
      shipmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/shipments/${shipmentId}.json`,
        ...opts,
      });
    },
    listInvoice(opts = {}) {
      return this._makeRequest({
        path: "/invoices.json",
        ...opts,
      });
    },
    getProduct({
      productId, ...opts
    }) {
      return this._makeRequest({
        path: `/products/${productId}.json`,
        ...opts,
      });
    },
    listProduct(opts = {}) {
      return this._makeRequest({
        path: "/products.json",
        ...opts,
      });
    },
    listBrands(opts = {}) {
      return this._makeRequest({
        path: "/brands.json",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks.json",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}.json`,
      });
    },
    async *paginate({
      fn, params = {}, dataField, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const response = await fn({
          params,
          ...opts,
        });
        for (const d of response[dataField]) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = response[dataField].length;

      } while (hasMore);
    },
  },
};
