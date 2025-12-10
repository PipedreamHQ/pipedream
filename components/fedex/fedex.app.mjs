import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fedex",
  propDefinitions: {
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "The account number associated with the shipment",
    },
    shipperStreetLines: {
      type: "string[]",
      label: "Shipper Street Lines",
      description: "Combination of number, street name, etc. At least one line is required for a valid physical address. Empty lines should not be included. Max Length is 35. Example: [1550 Union Blvd,Suite 302]",
    },
    shipperCity: {
      type: "string",
      label: "Shipper City",
      description: "The name of city, town of the recipient.Max length is 35. Example: Beverly Hills",
    },
    shipperStateOrProvinceCode: {
      type: "string",
      label: "Shipper State Or Province Code",
      description: "It is used to identify the principal subdivisions (e.g., provinces or states) of countries. The Format and presence of this field may vary depending on the country. Note: For specific countries, such as the United States and Canada, and Puerto Rico, there is a two-character state, province, codes limit . Example: TX",
      optional: true,
    },
    shipperPostalCode: {
      type: "string",
      label: "Shipper Postal Code",
      description: "This is the postal code. Note: This is Optional for non [postal-aware countries](https://developer.fedex.com/api/en-us/guides/api-reference.html#postalawarecountries). Maximum length is 10. Example: 65247",
      optional: true,
    },
    shipperCountryCode: {
      type: "string",
      label: "Shipper Country Code",
      description: "Is a capitalized two-character alpha code representing the country of the address. Example: US",
    },
    shipperContactName: {
      type: "string",
      label: "Shipper Contact Name",
      description: "Contact name, e.g. for customer support. Maximum length is 35. Example: John Doe",
    },
    shipperPhoneNumber: {
      type: "string",
      label: "Shipper Phone Number",
      description: "Contact phone number, e.g. for customer support. Maximum length is 10. Example: 15014321111",
    },
    recipientStreetLines: {
      type: "string[]",
      label: "Recipient Street Lines",
      description: "Combination of number, street name, etc. At least one line is required for a valid physical address. Empty lines should not be included. Max Length is 35. Example: [1550 Union Blvd,Suite 302]",
    },
    recipientCity: {
      type: "string",
      label: "Recipient City",
      description: "The name of city, town of the recipient.Max length is 35. Example: Beverly Hills",
    },
    recipientStateOrProvinceCode: {
      type: "string",
      label: "Recipient State Or Province Code",
      description: "It is used to identify the principal subdivisions (e.g., provinces or states) of countries. The Format and presence of this field may vary depending on the country. Note: For specific countries, such as the United States and Canada, and Puerto Rico, there is a two-character state, province, codes limit . Example: TX",
      optional: true,
    },
    recipientPostalCode: {
      type: "string",
      label: "Recipient Postal Code",
      description: "This is the postal code. Note: This is Optional for non [postal-aware countries](https://developer.fedex.com/api/en-us/guides/api-reference.html#postalawarecountries). Maximum length is 10. Example: 65247",
      optional: true,
    },
    recipientCountryCode: {
      type: "string",
      label: "Recipient Country Code",
      description: "Is a capitalized two-character alpha code representing the country of the address. Example: US",
    },
    recipientContactName: {
      type: "string",
      label: "Recipient Contact Name",
      description: "Contact name, e.g. for customer support. Maximum length is 35. Example: John Doe",
    },
    recipientPhoneNumber: {
      type: "string",
      label: "Recipient Phone Number",
      description: "Contact phone number, e.g. for customer support. Maximum length is 10. Example: 15014321111",
    },
    pickupType: {
      type: "string",
      label: "Pickup Type",
      description: "Indicates if shipment is being dropped off at a FedEx location or being picked up by FedEx or if it's a regularly scheduled pickup for this shipment.",
      options: [
        "CONTACT_FEDEX_TO_SCHEDULE",
        "DROPOFF_AT_FEDEX_LOCATION",
        "USE_SCHEDULED_PICKUP",
      ],
    },
    serviceType: {
      type: "string",
      label: "Service Type",
      description: "Indicate the FedEx [service type](https://developer.fedex.com/api/en-us/guides/api-reference.html#servicetypes) used for this shipment",
    },
    packagingType: {
      type: "string",
      label: "Packaging Type",
      description: "Specify the [packaging type](https://developer.fedex.com/api/en-us/guides/api-reference.html#packagetypes) used",
    },
    totalWeight: {
      type: "string",
      label: "Total Weight",
      description: "Indicate the shipment total weight in pounds",
    },
    paymentType: {
      type: "string",
      label: "Payment Type",
      description: "Indicates who and how the shipment will be paid for",
      options: [
        "SENDER",
        "RECIPIENT",
        "THIRD_PARTY",
        "COLLECT",
      ],
    },
    labelFormatType: {
      type: "string",
      label: "Label Format Type",
      description: "Specifies the label Format Type",
      options: [
        "COMMON2D",
        "LABEL_DATA_ONLY",
      ],
    },
    labelStockType: {
      type: "string",
      label: "Label Stock Type",
      description: "Label stock type used to create labels",
      options: [
        "PAPER_4X6",
        "STOCK_4X675",
        "PAPER_4X675",
        "PAPER_4X8",
        "PAPER_4X9",
        "PAPER_7X475",
        "PAPER_85X11_BOTTOM_HALF_LABEL",
        "PAPER_85X11_TOP_HALF_LABEL",
        "PAPER_LETTER",
        "STOCK_4X675_LEADING_DOC_TAB",
        "STOCK_4X8",
        "STOCK_4X9_LEADING_DOC_TAB",
        "STOCK_4X6",
        "STOCK_4X675_TRAILING_DOC_TAB",
        "STOCK_4X9_TRAILING_DOC_TAB",
        "STOCK_4X9",
        "STOCK_4X85_TRAILING_DOC_TAB",
        "STOCK_4X105_TRAILING_DOC_TAB",
      ],
    },
    imageType: {
      type: "string",
      label: "Image Type",
      description: "Specifies the image type of this shipping document",
      options: [
        "ZPLII",
        "EPL2",
        "PDF",
        "PNG",
      ],
    },
    weightUnit: {
      type: "string",
      label: "Weight Unit",
      description: "Specifies the package weight unit type",
      options: [
        "LB",
        "KG",
      ],
    },
    weights: {
      type: "string[]",
      label: "Weights",
      description: "An array of weight values for each of the requested pieces of the shipment",
    },
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number to track",
    },
    includeDetailedScans: {
      type: "boolean",
      label: "Include Detailed Scans",
      description: "Indicates whether to include detailed scan information in the response",
      default: false,
      optional: true,
    },
    shipDateBegin: {
      type: "string",
      label: "Ship Date Begin",
      description: "The beginning of the ship date range to track. Format: YYYY-MM-DD",
    },
    shipDateEnd: {
      type: "string",
      label: "Ship Date End",
      description: "The end of the ship date range to track. Format: YYYY-MM-DD",
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.server_type;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    createShipment(opts = {}) {
      return this._makeRequest({
        path: "/ship/v1/shipments",
        method: "POST",
        ...opts,
      });
    },
    validateShipment(opts = {}) {
      return this._makeRequest({
        path: "/ship/v1/shipments/packages/validate",
        method: "POST",
        ...opts,
      });
    },
    trackByTrackingNumber(opts = {}) {
      return this._makeRequest({
        path: "/track/v1/trackingnumbers",
        method: "POST",
        ...opts,
      });
    },
    trackByReference(opts = {}) {
      return this._makeRequest({
        path: "/track/v1/referencenumbers",
        method: "POST",
        ...opts,
      });
    },
    trackByTrackingControlNumber(opts = {}) {
      return this._makeRequest({
        path: "/track/v1/tcn",
        method: "POST",
        ...opts,
      });
    },
    trackMultiplePieceShipment(opts = {}) {
      return this._makeRequest({
        path: "/track/v1/associatedshipments",
        method: "POST",
        ...opts,
      });
    },
  },
};
