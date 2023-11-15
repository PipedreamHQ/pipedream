import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "starshipit",
  propDefinitions: {
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number of the order",
      optional: true,
      async options({ page }) {
        const params = {
          page: page + 1,
        };
        const { orders } = await this.listShippedOrders({
          params,
        });
        return orders.map(({ tracking_number }) => tracking_number ).filter((num) => num?.length);
      },
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The order number to print a shipping label",
      async options({
        page, shipped,
      }) {
        const params = {
          page: page + 1,
        };
        const { orders } = shipped
          ? await this.listShippedOrders({
            params,
          })
          : await this.listUnshippedOrders({
            params,
          });
        return orders.map(({ order_number }) => order_number );
      },
    },
    contactId: {
      type: "string",
      label: "Destination",
      description: "The contact to send the order to",
      async options({ page }) {
        const params = {
          page: page + 1,
        };
        const { addresses } =  await this.listContacts({
          params,
        });
        return addresses.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.starshipit.com/api";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _subscriptionKey() {
      return this.$auth.subscription_key;
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "StarShipIT-Api-Key": `${this._apiKey()}`,
        "Ocp-Apim-Subscription-Key": `${this._subscriptionKey()}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    createOrder(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        ...args,
      });
    },
    getTrackingDetails(args = {}) {
      return this._makeRequest({
        path: "/track",
        ...args,
      });
    },
    printShippingLabel(args = {}) {
      return this._makeRequest({
        path: "/orders/shipment",
        method: "POST",
        ...args,
      });
    },
    listShippedOrders(args = {}) {
      return this._makeRequest({
        path: "/orders/shipped",
        ...args,
      });
    },
    listUnshippedOrders(args = {}) {
      return this._makeRequest({
        path: "/orders/unshipped",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/addressbook/filtered",
        ...args,
      });
    },
    async paginate({
      resourceFn, resourceName,
    }) {
      const params = {
        page: 1,
        page_size: 50,
      };
      let total = 0;
      const results = [];
      do {
        const response = await resourceFn({
          params,
        });
        const items = response[resourceName];
        results.push(...items);
        total = items.length;
        params.page++;
      } while (total === params.page_size);
      return results;
    },
  },
};
