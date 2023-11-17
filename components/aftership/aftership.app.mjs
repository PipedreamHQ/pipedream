import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "aftership",
  propDefinitions: {
    trackingId: {
      type: "string",
      label: "Tracking ID",
      description: "The unique identifier of a tracking",
      async options({ prevContext }) {
        const page = prevContext.page || 1;
        const {
          items, meta,
        } = await this.listTrackings({
          page,
        });
        return {
          options: items.map((tracking) => ({
            label: tracking.tracking_number,
            value: tracking.id,
          })),
          context: {
            page: meta.current_page + 1,
          },
        };
      },
    },
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number of the shipment",
      optional: true,
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "The unique code of the courier",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the tracking",
      optional: true,
    },
    smses: {
      type: "string[]",
      label: "SMSes",
      description: "An array of phone numbers subscribed to receive SMS notifications",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "An array of emails subscribed to receive email notifications",
      optional: true,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer",
      optional: true,
    },
    destinationCountryIso3: {
      type: "string",
      label: "Destination Country ISO3",
      description: "The ISO Alpha-3 (three-letter) country code of the destination",
      optional: true,
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The order ID of the shipment",
      optional: true,
    },
    orderIdPath: {
      type: "string",
      label: "Order ID Path",
      description: "The tracking URL of the order",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields that users can set for the tracking",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.aftership.com/v4";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "aftership-api-key": this.$auth.api_key,
          "Content-Type": "application/json",
        },
      });
    },
    async createTracking(data) {
      return this._makeRequest({
        method: "POST",
        path: "/trackings",
        data,
      });
    },
    async getTrackingById(trackingId) {
      return this._makeRequest({
        path: `/trackings/${trackingId}`,
      });
    },
    async listTrackings({ page }) {
      return this._makeRequest({
        path: "/trackings",
        params: {
          page,
        },
      });
    },
    async updateTracking(trackingId, data) {
      return this._makeRequest({
        method: "PUT",
        path: `/trackings/${trackingId}`,
        data,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
