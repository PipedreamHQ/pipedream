import { axios } from "@pipedream/platform";
import { LANGUAGE_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "aftership",
  propDefinitions: {
    trackingId: {
      type: "string",
      label: "Tracking ID",
      description: "The unique identifier of a tracking",
      async options({ page }) {
        const { data: { trackings } } = await this.listTrackings({
          params: {
            page: page + 1,
          },
        });
        return trackings.map(({
          tracking_number: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number of the shipment.",
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "The unique code of the courier. Get courier codes [here](https://www.aftership.com/docs/tracking/others/supported-couriers).",
    },
    title: {
      type: "string",
      label: "Title",
      description: "By default this field shows the `tracking_number`, but you can customize it as you wish with any info (e.g. the order number).",
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "A globally-unique identifier for the order.",
    },
    orderIdPath: {
      type: "string",
      label: "Order ID Path",
      description: "The URL for the order in your system or store.",
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "A unique, human-readable identifier for the order.",
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields that accept an object with string field. In order to protect the privacy of your customers, do not include any [personal data](https://www.aftership.com/legal/dpa#:~:text=Personal%20Data%20means,that%20natural%20person) in custom fields.",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The recipient’s language. If you set up AfterShip notifications in different languages, we use this to send the recipient tracking updates in their preferred language.",
      options: LANGUAGE_OPTIONS,
    },
    smses: {
      type: "string[]",
      label: "SMSes",
      description: "The phone number(s) to receive sms notifications. Enter `+` andarea `code before` phone number. Accept either array or comma separated as input. Supports up to 3 phone numbers.",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Email address(es) to receive email notifications. Accept either array or comma separated as input. Supports up to 3 email addresses.",
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "Customer name of the tracking.",
    },
    destinationCountryIso3: {
      type: "string",
      label: "Destination Country ISO3",
      description: "The [ISO Alpha-3](https://support.aftership.com/en/article/iso3-country-code-rlpi07/) code (3 letters) for the origin country/region. E.g. USA for the United States. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc. Also the additional field required by some carriers to retrieve the tracking info. The origin country/region of the shipment.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.aftership.com";
    },
    _getHeaders() {
      return {
        "as-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    async createTracking(data) {
      return this._makeRequest({
        method: "POST",
        path: "/v4/trackings",
        data,
      });
    },
    async getTrackingById(trackingId) {
      return this._makeRequest({
        path: `/tracking/2023-10/trackings/${trackingId}`,
      });
    },
    async listTrackings(opts = {}) {
      return this._makeRequest({
        path: "/tracking/2023-10/trackings",
        ...opts,
      });
    },
    async updateTracking({
      trackingId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tracking/2023-10/trackings/${trackingId}`,
        ...opts,
      });
    },
  },
};
