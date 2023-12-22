import { axios } from "@pipedream/platform";
import {
  DELIVERY_TYPE_OPTIONS, LANGUAGE_OPTIONS, SLUG_GROUP_OPTIONS,
} from "./common/constants.mjs";

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
    orderPromisedDeliveryDate: {
      type: "string",
      label: "Order Promised Delivery Date",
      description: "The promised delivery date of the order. It uses the format `YYYY-MM-DD`.",
      optional: true,
    },
    deliveryType: {
      type: "string",
      label: "Delivery Type",
      description: "Shipment delivery type.",
      optional: true,
      options: DELIVERY_TYPE_OPTIONS,
    },
    pickupLocation: {
      type: "string",
      label: "Pickup location",
      description: "Shipment pickup location for receiver.",
      optional: true,
    },
    pickupNote: {
      type: "string",
      label: "Pickup Note",
      description: "Shipment pickup note for receiver.",
      optional: true,
    },
    trackingAccountNumber: {
      type: "string",
      label: "Tracking Account Number",
      description: "The shipper's carrier account number. Refer to [this article on additional tracking fields](https://www.aftership.com/docs/tracking/enum/additional-tracking-fields) for more details.",
      optional: true,
    },
    trackingKey: {
      type: "string",
      label: "Tracking Key",
      description: "A type of tracking credential required by some carriers. Refer to [this article on additional tracking fields](https://www.aftership.com/docs/tracking/enum/additional-tracking-fields) for more details.",
      optional: true,
    },
    trackingShipDate: {
      type: "string",
      label: "Tracking Ship Date",
      description: "The date the shipment was sent, using the format `YYYYMMDD`. Refer to [this article on additional tracking fields](https://www.aftership.com/docs/tracking/enum/additional-tracking-fields) for more details.",
      optional: true,
    },
    originCountryIso3: {
      type: "string",
      label: "Origin Country ISO3",
      description: "The [ISO Alpha-3 code](https://support.aftership.com/en/article/iso3-country-code-rlpi07/) (3 letters) for the origin country/region. E.g. `USA` for the United States. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    originState: {
      type: "string",
      label: "Origin State",
      description: "The state of the sender's address. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    originCity: {
      type: "string",
      label: "Origin City",
      description: "The city of the sender's address. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    originPostalCode: {
      type: "string",
      label: "Origin Postal Code",
      description: "The postal of the sender's address. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    originRawLocation: {
      type: "string",
      label: "Origin Raw Location",
      description: "The sender address that the shipment is shipping from. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    destinationCountryIso3: {
      type: "string",
      label: "Destination Country ISO3",
      description: "The [ISO Alpha-3 code](https://support.aftership.com/en/article/iso3-country-code-rlpi07/) (3 letters) for the destination country/region. E.g. `USA` for the United States. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    destinationState: {
      type: "string",
      label: "Destination State",
      description: "The state of the recipient's address. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    destinationCity: {
      type: "string",
      label: "Destination City",
      description: "The city of the recipient's address. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    destinationPostalCode: {
      type: "string",
      label: "Destination Postal Code",
      description: "The postal of the recipient's address. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    destinationRawLocation: {
      type: "string",
      label: "Destination Raw Location",
      description: "The shipping address that the shipment is shipping to. This can help AfterShip with various functions like tracking, carrier auto-detection and auto-correction, calculating an EDD, etc.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Text field for the note.",
      optional: true,
    },
    slugGroup: {
      type: "string",
      label: "Slug Group",
      description: "Slug group is a group of slugs which belong to same courier. [See the documentation for more information](https://www.aftership.com/docs/tracking/enum/slug-groups). It cannot be used with `slug` at the same time.",
      optional: true,
      options: SLUG_GROUP_OPTIONS,
    },
    orderDate: {
      type: "string",
      label: "Order Date",
      description: "Order date in YYYY-MM-DDTHH:mm:ssZ format. e.g. `2021-07-26T11:23:51-05:00`",
      optional: true,
    },
    shipmentType: {
      type: "string",
      label: "Shipment Type",
      description: "The carrier service type for the shipment. If you provide info for this field, AfterShip will not update it with info from the carrier.",
      optional: true,
    },
    shipmentTags: {
      type: "string[]",
      label: "Shipment Tags",
      description: "Used to add tags to your shipments to help categorize and filter them easily. Max 50 items.",
      optional: true,
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
    async createTracking(args) {
      return this._makeRequest({
        method: "POST",
        path: "/v4/trackings",
        ...args,
      });
    },
    async getTrackingById({
      trackingId, ...args
    }) {
      return this._makeRequest({
        path: `/tracking/2023-10/trackings/${trackingId}`,
        ...args,
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
