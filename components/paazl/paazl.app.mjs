import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paazl",
  propDefinitions: {
    reference: {
      type: "string",
      label: "Order Reference",
      description: "Your reference for the order",
    },
    consigneeCountryCode: {
      type: "string",
      label: "Consignee Country Code",
      description: "The [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for the country to which an order is shipped (e.g., `NL`, `DE`)",
    },
    consigneePostalCode: {
      type: "string",
      label: "Consignee Postal Code",
      description: "The postal code of the address to which an order is shipped",
      optional: true,
    },
    consignorCountryCode: {
      type: "string",
      label: "Consignor Country Code",
      description: "The [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for the country the shipment is being sent from",
      optional: true,
    },
    consignorPostalCode: {
      type: "string",
      label: "Consignor Postal Code",
      description: "The postal code of the address from which an order is shipped",
      optional: true,
    },
    orderReference: {
      type: "string",
      label: "Order Reference",
      description: "Your reference for the order",
    },
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "The shipment identifier",
      async options({ orderReference }) {
        const { shipments } = await this.getOrderShipments({
          orderReference,
        });
        return shipments.map(({ trackingNumber: value }) => value);
      },
    },
    parcelId: {
      type: "string",
      label: "Parcel ID",
      description: "The parcel identifier",
    },
    shippingOptionId: {
      type: "string",
      label: "Shipping Option ID",
      description: "The shipping option identifier",
      optional: true,
      async options() {
        const { shippingOptions } = await this.getShippingOptions();
        return shippingOptions.map(({
          identifier: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    pickupLocationCode: {
      type: "string",
      label: "Pickup Location Code",
      description: "A carrier's unique code for a pickup location (required if delivering to pickup location)",
      optional: true,
      async options() {
        const { pickupLocations } = await this.getPickupLocationOptions();
        return pickupLocations.map(({
          code: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Specifies the language in which the widget is displayed. It is specified using the format `{language}_{country}`, where `{language}` is an [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code and `{country}` is an [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) country code (e.g., `en_US`)",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Specifies the time zone for which the delivery days should be calculated (e.g., `Europe/Amsterdam`, `UTC`)",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of shipping options that Paazl must return (min: `1`, max: `99`)",
      optional: true,
      min: 1,
      max: 99,
    },
    numberOfProcessingDays: {
      type: "integer",
      label: "Number of Processing Days",
      description: "The number of days a warehouse needs to get an order ready for pick-up by a carrier (min: 0, max: 99)",
      optional: true,
      min: 0,
      max: 99,
    },
    includeExternalDeliveryDates: {
      type: "boolean",
      label: "Include External Delivery Dates",
      description: "Gets delivery dates directly from the carrier if the carrier supplies them",
      optional: true,
    },
    deliveryDateStartDate: {
      type: "string",
      label: "Delivery Date Start Date",
      description: "The starting point of a range of possible delivery dates (format: YYYY-MM-DD)",
      optional: true,
    },
    deliveryDateNumberOfDays: {
      type: "integer",
      label: "Delivery Date Number of Days",
      description: "The length of time in days after start date for which shipping options are supplied",
      optional: true,
    },
    token: {
      type: "string",
      label: "Token",
      description: "The access token returned by the token endpoint",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Codes that are used to filter returned shipping options for display",
      optional: true,
      options: [
        "PARCEL_LOCKER",
        "SAME_DAY",
        "FLEX_DELIVERY",
        "CASH_ON_DELIVERY",
        "INSURANCE",
        "SIGNATURE_REQUIRED",
        "AT_NEIGHBOURS",
        "NOT_AT_NEIGHBOURS",
        "RETURN_ON_FAILURE",
        "DATE_PREFERENCE",
        "TWENTYFOUR_SEVEN",
        "NOTIFY_RECEIVER",
        "SUNDAY_SORTING",
        "AGE_CHECK",
        "ID_CHECK",
        "CLIMATE_COMPENSATION",
        "DANGEROUS_GOODS",
        "RETURN_TO_SENDER",
        "NO_PROOF_OF_DELIVERY",
        "PERISHABLE",
      ],
    },
    totalWeight: {
      type: "string",
      label: "Total Weight",
      description: "The total weight in kilograms (kg) of the shipment, including packaging",
      optional: true,
    },
    totalPrice: {
      type: "string",
      label: "Total Price",
      description: "The total price of a shipment",
      optional: true,
    },
    totalVolume: {
      type: "string",
      label: "Total Volume",
      description: "The total volume of a shipment, including packaging, in cubic meters",
      optional: true,
    },
    numberOfGoods: {
      type: "integer",
      label: "Number of Goods",
      description: "The total number of packages or individual goods in a shipment",
      optional: true,
    },
    startMatrix: {
      type: "string",
      label: "Start Matrix",
      description: "A one- or two-letter code identifying the delivery matrix column to start with",
      optional: true,
    },
    network: {
      type: "string",
      label: "Network",
      description: "Specifies what type(s) of pickup locations you want Paazl to send you",
      optional: true,
      options: [
        "CARRIER",
        "STORE",
        "ALL",
      ],
    },
    crossBorderStores: {
      type: "boolean",
      label: "Cross Border Stores",
      description: "Shows stores from different countries",
      optional: true,
    },
    excludeLockers: {
      type: "boolean",
      label: "Exclude Lockers",
      description: "Get all shipping options except those that have parcel locker support",
      optional: true,
    },
    lockersOnly: {
      type: "boolean",
      label: "Lockers Only",
      description: "Get only shipping options with parcel locker support",
      optional: true,
    },
    sortOrderBy: {
      type: "string",
      label: "Sort Order By",
      description: "Indicates the field by which to sort the shipping options returned",
      optional: true,
      options: [
        "PRICE",
        "DATE",
        "CARRIER",
      ],
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Indicates the order in which shipping options should be sorted",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    sortDistributor: {
      type: "string",
      label: "Sort Distributor",
      description: "Indicates which carrier's shipping options should appear at the top (required if orderBy is CARRIER)",
      optional: true,
      options: [
        "SELEKTVRACHT",
        "TNT",
        "TNT_EXPRESS",
        "DPD",
        "FEDEX",
        "DYNALOGIC",
        "KIALA",
        "DHL_EXPRESS",
        "DHL_DE",
        "UPS",
        "BPOST",
        "GLS",
        "TSN",
        "MONDIALRELAY",
        "B2C_EUROPE",
        "B2C_EUROPE_LAB",
        "DE_BUREN",
        "CARGOOFFICE",
        "VAN_SPREUWEL",
        "PACKS",
        "COLISSIMO",
        "BRT",
        "CORREOS",
        "TRANSMISSION",
        "HERMES",
        "FADELLO",
        "AUS_POST",
        "SAGAWA",
        "ASENDIA",
        "MENDRIX",
        "FEDEX_ZA",
        "RJP",
        "YUNDA_EXPRESS",
        "HERMES_UK",
        "POSTNORD",
        "BLANK",
        "GENERIC",
      ],
    },
    consigneeName: {
      type: "string",
      label: "Consignee Name",
      description: "The name of the person to whom an order is shipped",
    },
    consigneeEmail: {
      type: "string",
      label: "Consignee Email",
      description: "The email address of the person to whom an order is shipped",
      optional: true,
    },
    consigneePhone: {
      type: "string",
      label: "Consignee Phone",
      description: "The phone number of the person to whom an order is shipped",
      optional: true,
    },
    consigneeCompanyName: {
      type: "string",
      label: "Consignee Company Name",
      description: "The name of a company to which an order is shipped",
      optional: true,
    },
    consigneeLocale: {
      type: "string",
      label: "Consignee Locale",
      description: "Language of email templates for track & trace notifications (format: language_country, e.g., 'en_US')",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "Address City",
      description: "The city or town to which an order is shipped",
    },
    addressCountry: {
      type: "string",
      label: "Address Country",
      description: "The ISO 3166-2 code for the country to which an order is shipped (e.g., 'NL', 'DE')",
    },
    addressPostalCode: {
      type: "string",
      label: "Address Postal Code",
      description: "The postal code of the address to which an order is shipped",
    },
    addressStreet: {
      type: "string",
      label: "Address Street",
      description: "The name of the street to which an order is shipped",
      optional: true,
    },
    addressHouseNumber: {
      type: "integer",
      label: "Address House Number",
      description: "The house number of the address to which an order is shipped",
      optional: true,
    },
    addressHouseNumberExtension: {
      type: "string",
      label: "Address House Number Extension",
      description: "The house number extension (such as '-A' in '12-A')",
      optional: true,
    },
    addressProvince: {
      type: "string",
      label: "Address Province",
      description: "The last 2 letters of the ISO 3166-2 code for the province or state",
      optional: true,
    },
    addressStreetLines: {
      type: "string[]",
      label: "Address Street Lines",
      description: "The street name and house number specified as one or more strings",
      optional: true,
    },
    shippingOption: {
      type: "string",
      label: "Shipping Option",
      description: "A shipping option's Paazl identifier",
    },
    shippingContract: {
      type: "string",
      label: "Shipping Contract",
      description: "The identification code of your carrier contract for an outbound shipment",
      optional: true,
    },
    shippingReturnContract: {
      type: "string",
      label: "Shipping Return Contract",
      description: "The identification code of your carrier contract for a return shipment",
      optional: true,
    },
    shippingPackageCount: {
      type: "integer",
      label: "Shipping Package Count",
      description: "The number of packages in a shipment",
      optional: true,
    },
    shippingMultiPackageShipment: {
      type: "boolean",
      label: "Multi Package Shipment",
      description: "If true, Paazl will treat the shipment as consolidated",
      optional: true,
    },
    pickupLocationAccountNumber: {
      type: "string",
      label: "Pickup Location Account Number",
      description: "An account number that a carrier can issue to customers",
      optional: true,
    },
    orderDescription: {
      type: "string",
      label: "Order Description",
      description: "A general description of the contents of a shipment",
      optional: true,
    },
    orderWeight: {
      type: "string",
      label: "Order Weight",
      description: "The total weight in kilograms (kg) of an order, including packaging",
      optional: true,
    },
    requestedDeliveryDate: {
      type: "string",
      label: "Requested Delivery Date",
      description: "The date on which a customer has requested that an order be delivered (format: YYYY-MM-DD)",
      optional: true,
    },
    additionalInstruction: {
      type: "string",
      label: "Additional Instructions",
      description: "Additional instructions for the delivery of an order",
      optional: true,
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "The invoice number of an order (sometimes required for international shipments)",
      optional: true,
    },
    invoiceDate: {
      type: "string",
      label: "Invoice Date",
      description: "The invoice date of an order (format: YYYY-MM-DD)",
      optional: true,
    },
    labelType: {
      type: "string",
      label: "Label Type",
      description: "Format of the generated label(s)",
      optional: true,
      options: [
        "PNG",
        "PDF",
        "ZPL",
      ],
    },
    labelSize: {
      type: "string",
      label: "Label Size",
      description: "Size of the generated label(s)",
      optional: true,
      options: [
        "10x15",
        "10x21",
        "a4",
        "laser",
      ],
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Optional. If quantity == 1 -> one extra label is generated. If quantity > 1, extra labels are generated. Mutually exclusive with parcels.",
      optional: true,
      min: 1,
    },
    enableParcels: {
      type: "boolean",
      label: "Enable Custom Parcels",
      description: "Enable to specify custom parcel details (mutually exclusive with quantity)",
      optional: true,
    },
    parcelWeight: {
      type: "string",
      label: "Parcel Weight",
      description: "The gross weight of the parcel in kilograms (required if enabling parcels)",
      optional: true,
    },
    parcelLength: {
      type: "integer",
      label: "Parcel Length",
      description: "The length of the parcel in centimeters",
      optional: true,
    },
    parcelWidth: {
      type: "integer",
      label: "Parcel Width",
      description: "The width of the parcel in centimeters",
      optional: true,
    },
    parcelHeight: {
      type: "integer",
      label: "Parcel Height",
      description: "The height of the parcel in centimeters",
      optional: true,
    },
    parcelVolume: {
      type: "string",
      label: "Parcel Volume",
      description: "The volume of the parcel, including packaging, in cubic meters",
      optional: true,
    },
    parcelReference: {
      type: "string",
      label: "Parcel Reference",
      description: "A reference for the parcel",
      optional: true,
    },
    parcelDescription: {
      type: "string",
      label: "Parcel Description",
      description: "A general description of the contents of the parcel",
      optional: true,
    },
    parcelCodValue: {
      type: "string",
      label: "Parcel COD Value",
      description: "The amount that has to be paid by receiver before receiving the goods",
      optional: true,
    },
    parcelCodCurrency: {
      type: "string",
      label: "Parcel COD Currency",
      description: "The ISO 4217 code for the currency (default: EUR)",
      optional: true,
      default: "EUR",
    },
    parcelInsuredValue: {
      type: "string",
      label: "Parcel Insured Value",
      description: "The amount for which this is insured by the carrier",
      optional: true,
    },
    parcelInsuredCurrency: {
      type: "string",
      label: "Parcel Insured Currency",
      description: "The ISO 4217 code for the currency (default: EUR)",
      optional: true,
      default: "EUR",
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.paazl.com/v1${path}`;
    },
    getHeaders(isPublic = false) {
      const {
        api_key: apiKey,
        api_secret: apiSecret,
      } = this.$auth;

      const authToken = isPublic
        ? `Bearer ${apiKey}`
        : `Bearer ${apiKey}:${apiSecret}`;

      return {
        "Authorization": authToken,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    makeRequest({
      $ = this, path, headers = {}, isPublic = false, ...args
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: {
          ...this.getHeaders(isPublic),
          ...headers,
        },
        ...args,
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    createCheckoutToken(args = {}) {
      return this.post({
        path: "/checkout/token",
        ...args,
      });
    },
    saveCheckoutSession(args = {}) {
      return this.post({
        isPublic: true,
        path: "/checkout",
        ...args,
      });
    },
    getCheckoutSession(args = {}) {
      return this.makeRequest({
        path: "/checkout",
        ...args,
      });
    },
    saveOrder(args = {}) {
      return this.post({
        path: "/order",
        ...args,
      });
    },
    modifyOrder(args = {}) {
      return this.put({
        path: "/order",
        ...args,
      });
    },
    deleteOrder({
      reference, ...args
    } = {}) {
      return this.delete({
        path: `/order/${reference}`,
        ...args,
      });
    },
    getPickupLocationOptions(args = {}) {
      return this.post({
        path: "/pickuplocations",
        isPublic: true,
        ...args,
      });
    },
    getShippingOptions(args = {}) {
      return this.post({
        path: "/shippingoptions",
        isPublic: true,
        ...args,
      });
    },
    createShipment({
      orderReference, ...args
    } = {}) {
      return this.post({
        path: `/orders/${orderReference}/shipments`,
        ...args,
      });
    },
    getOrderShipments({
      orderReference, ...args
    } = {}) {
      return this.makeRequest({
        path: `/orders/${orderReference}/shipments`,
        ...args,
      });
    },
    getShipmentById({
      orderReference, shipmentId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/orders/${orderReference}/shipments/${shipmentId}`,
        ...args,
      });
    },
    getOrderLabels({
      orderReference, ...args
    } = {}) {
      return this.makeRequest({
        path: `/orders/${orderReference}/labels`,
        ...args,
      });
    },
    getShipmentLabels({
      orderReference, shipmentId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/orders/${orderReference}/shipments/${shipmentId}/labels`,
        ...args,
      });
    },
    getParcelLabel({
      orderReference, shipmentId, parcelId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/orders/${orderReference}/shipments/${shipmentId}/parcels/${parcelId}/labels`,
        ...args,
      });
    },
    getReturnShipments({
      orderReference, ...args
    } = {}) {
      return this.makeRequest({
        path: `/orders/${orderReference}/returnShipments`,
        ...args,
      });
    },
  },
};
