import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "discogs",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "Select the order to update",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 1;
        const {
          orders, pagination,
        } = await this.listOrders({
          page,
        });
        const options = orders.map((order) => ({
          label: `Order ${order.id} (${order.status})`,
          value: order.id,
        }));
        return {
          options,
          context: {
            page: pagination.page + 1,
          },
        };
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Select the new status for the order",
      options: [
        {
          label: "New Order",
          value: "New Order",
        },
        {
          label: "Cancelled",
          value: "Cancelled",
        },
        // Include other statuses as needed
      ],
    },
    listingCondition: {
      type: "string",
      label: "Condition",
      description: "Select the condition of the item",
      options: [
        {
          label: "Mint (M)",
          value: "Mint (M)",
        },
        {
          label: "Near Mint (NM or M-)",
          value: "Near Mint (NM or M-)",
        },
        // Include other conditions as needed
      ],
    },
    sleeveCondition: {
      type: "string",
      label: "Sleeve Condition",
      description: "Select the condition of the sleeve",
      options: [
        {
          label: "Mint (M)",
          value: "Mint (M)",
        },
        {
          label: "Near Mint (NM or M-)",
          value: "Near Mint (NM or M-)",
        },
        // Include other sleeve conditions as needed
      ],
    },
    listingStatus: {
      type: "string",
      label: "Listing Status",
      description: "Select the status of the listing",
      options: [
        {
          label: "For Sale",
          value: "For Sale",
        },
        {
          label: "Not For Sale",
          value: "Not For Sale",
        },
        // Include other listing statuses as needed
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.discogs.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "User-Agent": "PipedreamDiscogsApp/1.0",
          "Authorization": `Discogs token=${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listOrders({ page }) {
      return this._makeRequest({
        path: `/marketplace/orders?page=${page}`,
      });
    },
    async updateOrderStatus({
      orderId, status,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/marketplace/orders/${orderId}`,
        data: {
          status,
        },
      });
    },
    async createListing({
      releaseId,
      condition,
      sleeveCondition,
      price,
      comments,
      allowOffers,
      status,
      externalId,
      location,
      weight,
      formatQuantity,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/marketplace/listings",
        data: {
          release_id: releaseId,
          condition,
          sleeve_condition: sleeveCondition,
          price,
          comments,
          allow_offers: allowOffers,
          status,
          external_id: externalId,
          location,
          weight,
          format_quantity: formatQuantity,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
