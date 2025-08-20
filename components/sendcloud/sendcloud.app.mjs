import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "sendcloud",
  propDefinitions: {
    parcelId: {
      type: "string",
      label: "Parcel ID",
      description: "The unique identifier of the parcel",
      async options({ prevContext }) {
        const params = {};

        if (prevContext?.cursor) params.cursor = prevContext.cursor;

        const {
          parcels: resources, next,
        } = await this.listParcels({
          params,
        });

        return {
          context: {
            cursor: next,
          },
          options: resources.map(({
            id, name,
          }) => ({
            value: id,
            label: name,
          })),
        };
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the recipient",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the recipient",
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the recipient",
      optional: true,
    },
    houseNumber: {
      type: "string",
      label: "House Number",
      description: "House number of the recipient",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Zip code of the recipient",
    },
    country: {
      type: "string",
      label: "country",
      description: "Country of the recipient",
      options: constants.COUNTRIES,
    },
    integrationId: {
      type: "string",
      label: "Integration ID",
      description: "The ID of the integration",
      async options() {
        const integrations = await this.listIntegrations();

        return integrations.map(({
          id: value, shop_name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 currency code",
      options: [
        "EUR",
        "USD",
        "GBP",
      ],
    },
    senderAddress: {
      type: "string",
      label: "Sender Address ID",
      description: "Specify a sender address ID to display proper allowed_shipping_methods.",
      async options() {
        const { sender_addresses: senderAddresses } = await this.listSenderAddresses({
          params: {
            page_size: 100,
          },
        });

        return senderAddresses.map(({
          id: value, contact_name: name, email,
        }) => ({
          value,
          label: `${name} (${email})`,
        }));
      },
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the shipment.",
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "Timestamp when the shipment was created in the shop system. Example: `2022-05-07T15:08:12.152000Z`",
    },
    customsInvoiceNr: {
      type: "string",
      label: "Customs Invoice Number",
      description: "Commercial invoice number",
    },
    customsShipmentType: {
      type: "string",
      label: "Customs Shipment Type",
      description: "The type of shipment for customs purposes.",
      options: [
        {
          value: "0",
          label: "Gift",
        },
        {
          value: "1",
          label: "Documents",
        },

        {
          value: "2",
          label: "Commercial Goods",
        },
        {
          value: "3",
          label: "Commercial Sample",
        },
        {
          value: "4",
          label: "Returned Goods",
        },
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the recipient.",
    },
    externalOrderId: {
      type: "string",
      label: "External Order ID",
      description: "External order ID assigned by the shop system",
    },
    externalShipmentId: {
      type: "string",
      label: "External Shipment ID",
      description: "External shipment ID assigned by the shop system",
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "Unique order number generated manually or by the shop system",
    },
    orderStatusId: {
      type: "string",
      label: "Order Status ID",
      description: "Custom internal shop status ID",
    },
    orderStatusMessage: {
      type: "string",
      label: "Order Status Message",
      description: "User-defined human readable status",
    },
    parcelItems: {
      type: "string[]",
      label: "Parcel Items",
      description: `Array of JSON objects describing each item in the parcel. Each item must include the following fields:
- \`description\` (string, required): Description of the product. Example: \`Bag\`
- \`hs_code\` (string): Harmonized System Code (<= 12 chars). Example: \`01013000\`
- \`origin_country\` (string | null): ISO 3166-1 alpha-2 country code where the product was produced. Example: \`NL\`
- \`product_id\` (string): Internal product ID. Example: \`1458734634\`
- \`properties\` (object): Key-value pairs with additional product properties (e.g., \`{ "color": "Black" }\`)
- \`quantity\` (integer, required): Number of units (>= 1). Example: \`2\`
- \`sku\` (string): Internal stock keeping unit. Example: \`WW-DR-GR-XS-001\`
- \`value\` (string, required): Price per item as a decimal string. Example: \`19.99\`
- \`weight\` (string | null): Weight per item as a decimal string. Example: \`0.5\`
- \`mid_code\` (string | null): Manufacturer's Identification code. Example: \`NLOZR92MEL\`
- \`material_content\` (string | null): Description of materials. Example: \`100% Cotton\`
- \`intended_use\` (string | null): Intended use of the contents. Example: \`Personal use\`

Example item JSON:
\`\`\`json
{
  "description": "Bag",
  "hs_code": "01013000",
  "origin_country": "NL",
  "product_id": "1458734634",
  "properties": { "color": "Black" },
  "quantity": 2,
  "sku": "WW-DR-GR-XS-001",
  "value": "19.99",
  "weight": "0.5",
  "mid_code": "NLOZR92MEL",
  "material_content": "100% Cotton",
  "intended_use": "Personal use"
}
\`\`\`

Provide each array element as a JSON object string in the UI, or programmatically as an array of objects.`,
    },
    paymentStatusId: {
      type: "string",
      label: "Payment Status ID",
      description: "Custom internal payment status ID",
    },
    paymentStatusMessage: {
      type: "string",
      label: "Payment Status Message",
      description: "User-defined payment status",
    },
    shippingMethodCheckoutName: {
      type: "string",
      label: "Shipping Method Checkout Name",
      description: "Human readable shipping method name",
    },
    telephone: {
      type: "string",
      label: "Telephone",
      description: "The telephone number of the recipient.",
    },
    toPostNumber: {
      type: "string",
      label: "To Post Number",
      description: "The post number of the recipient.",
    },
    servicePointId: {
      type: "integer",
      label: "Service Point",
      description: "The service point ID of the recipient.",
      async options({ country }) {
        const servicePoints = await this.listServicePoints({
          params: {
            country,
          },
        });

        return servicePoints.map(({
          id: value, name,
        }) => ({
          value,
          label: name,
        }));
      },
    },
    toState: {
      type: "string",
      label: "To State",
      description: "The state of the recipient.",
    },
    totalOrderValue: {
      type: "string",
      label: "Total Order Value",
      description: "Total price of the order (decimal string)",
      optional: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated At",
      description: "Timestamp when the shipment was updated in the shop system. Example: `2022-05-07T15:08:12.152000Z`",
    },
    weight: {
      type: "string",
      label: "Weight",
      description: "Total weight of the order (decimal string)",
      optional: true,
    },
    checkoutPayload: {
      type: "object",
      label: "Checkout Payload",
      description: `Object capturing checkout selections made by the end-consumer.

Required keys:
- \`sender_address_id\` (integer): The sender address ID associated with the order.
- \`shipping_product\` (object): The shipping product chosen at checkout. Must include:
  - \`code\` (string)
  - \`name\` (string)
  - \`selected_functionalities\` (array): Functionalities selected for this product.
- \`delivery_method_type\` (string): One of "standard_delivery", "nominated_day_delivery", or "same_day_delivery".
- \`delivery_method_data\` (object):
  - \`delivery_date\` (string, date-time): Delivery date required by the end-consumer.
  - \`formatted_delivery_date\` (string): Human-readable date (e.g., "February 21, 2012").
  - \`parcel_handover_date\` (string, date-time): Date the parcel must be handed to the carrier.

Example:
\`\`\`json
{
  "sender_address_id": 12345,
  "shipping_product": {
    "code": "pd-pickup",
    "name": "Pickup Point",
    "selected_functionalities": ["signature", "age_check"]
  },
  "delivery_method_type": "nominated_day_delivery",
  "delivery_method_data": {
    "delivery_date": "2025-02-20T09:00:00Z",
    "formatted_delivery_date": "February 20, 2025",
    "parcel_handover_date": "2025-02-19T18:00:00Z"
  }
}
\`\`\``,
      optional: true,
    },
    customDetails: {
      type: "object",
      label: "Costs & Tax Details",
      description: `Optional object to provide order-level costs and tax numbers.

- \`discount_granted\` (object): Discount granted on the total order
  - \`value\` (string | null): Decimal amount (e.g., "3.99"), pattern: [\\d]+(\\.[\\d]+)?
  - \`currency\` (string | null): ISO 4217 code (e.g., "EUR")
- \`insurance_costs\` (object): Amount the order is insured for
  - \`value\` (string | null): Decimal amount (e.g., "3.99"), pattern: [\\d]+(\\.[\\d]+)?
  - \`currency\` (string | null): ISO 4217 code (e.g., "EUR")
- \`freight_costs\` (object): Shipping cost of the order
  - \`value\` (string | null): Decimal amount (e.g., "3.99"), pattern: [\\d]+(\\.[\\d]+)?
  - \`currency\` (string | null): ISO 4217 code (e.g., "EUR")
- \`other_costs\` (object): Any other costs (e.g., wrapping costs)
  - \`value\` (string | null): Decimal amount (e.g., "3.99"), pattern: [\\d]+(\\.[\\d]+)?
  - \`currency\` (string | null): ISO 4217 code (e.g., "EUR")
- \`tax_numbers\` (object | null): Tax info about sender, receiver, and importer of records
  - \`sender\` (array of Tax Number): Each has { name (string|null), country_code (string|null), value (string|null) }
  - \`receiver\` (array of Tax Number): Same structure as sender
  - \`importer_of_records\` (array of Tax Number): Same structure as sender

Example:
\`\`\`json
{
  "discount_granted": { "value": "3.99", "currency": "EUR" },
  "insurance_costs": { "value": "2.50", "currency": "EUR" },
  "freight_costs": { "value": "5.00", "currency": "EUR" },
  "other_costs": { "value": null, "currency": null },
  "tax_numbers": {
    "sender": [{ "name": "VAT", "country_code": "NL", "value": "NL987654321B02" }],
    "receiver": [],
    "importer_of_records": []
  }
}
\`\`\``,
      optional: true,
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "Reference latitude for distance calculation.",
      optional: true,
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "Reference longitude for distance calculation.",
      optional: true,
    },
    neLatitude: {
      type: "string",
      label: "NE Latitude",
      description: "Latitude of the northeast corner of the bounding box.",
      optional: true,
    },
    neLongitude: {
      type: "string",
      label: "NE Longitude",
      description: "Longitude of the northeast corner of the bounding box.",
      optional: true,
    },
    swLatitude: {
      type: "string",
      label: "SW Latitude",
      description: "Latitude of the southwest corner of the bounding box.",
      optional: true,
    },
    swLongitude: {
      type: "string",
      label: "SW Longitude",
      description: "Longitude of the southwest corner of the bounding box.",
      optional: true,
    },
    accessToken: {
      type: "string",
      label: "Access Token",
      description: "JWT containing user 'id' or 'iid' (integration ID), or a public API key.",
      optional: true,
    },
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The unique identifier of the return",
      async options({
        fromDate, toDate,
      }) {
        if (!fromDate || !toDate) {
          return [];
        }

        const { data } = await this.listReturns({
          params: {
            from_date: fromDate,
            to_date: toDate,
          },
        });

        return data.map(({
          reason: {
            id: value,
            description: label,
          },
        }) => ({
          value,
          label,
        }));
      },
    },
    addressSetup: {
      type: "object",
      label: "From Address",
      description: `Required fields:
- \`name\` (string): Name associated with the address. Example: \`John Doe\`
- \`address_line_1\` (string): First line of the address. Example: \`Stadhuisplein\`
- \`postal_code\` (string): Zip code. Example: \`1013 AB\`
- \`city\` (string): City. Example: \`Eindhoven\`
- \`country_code\` (string): ISO 3166-1 alpha-2 code. Example: \`NL\`

Optional fields:
- \`company_name\` (string): Company name. Example: \`Sendcloud\`
- \`house_number\` (string): House number. Example: \`50\`
- \`address_line_2\` (string): Additional info. Example: \`Apartment 17B\`
- \`po_box\` (string | null): PO box code
- \`state_province_code\` (string): ISO 3166-2 code. Example: \`IT-RM\`
- \`email\` (string): Email. Example: \`johndoe@gmail.com\`
- \`phone_number\` (string): Phone number. Example: \`+319881729999\`

Example:
\`\`\`json
{
  "name": "John Doe",
  "address_line_1": "Stadhuisplein",
  "postal_code": "1013 AB",
  "city": "Eindhoven",
  "country_code": "NL"
}
\`\`\`
`,
    },
    shipWith: {
      type: "object",
      label: "Ship With",
      description: `Shipping specifications chosen for the return.

Fields:
- type (string): How the carrier/method is selected. One of \`shipping_option_code\` or \`shipping_product_code\` (default is \`shipping_product_code\`).
- \`shipping_option_code\` (string): Required if type = \`shipping_option_code\`. Example: \`dpd:return/return\`
- \`shipping_product_code\` (string): Required if type = \`shipping_product_code\`. Example: \`dpd:return/return\`
- \`functionalities\` (object): Shipping functionalities. Provide only when type = \`shipping_product_code\`.
- \`contract\` (integer): Contract ID to ship the return with.
- \`dimensions\` (object):
  - \`length\` (number, >= 0)
  - \`width\` (number, >= 0)
  - \`height\` (number, >= 0)
  - \`unit\` (string): One of  \`cm\`, \`mm\`, \`m\`, \`yd\`, \`ft\`, \`in\`
- \`weight\` (object):
  - \`value\` (number, > 0)
  - \`unit\` (string): One of \`kg\`, \`g\`, \`lbs\`, \`oz\`

Example:
\`\`\`json
{
  "type": "shipping_option_code",
  "shipping_option_code": "dpd:return/return",
  "contract": 1234,
  "dimensions": { "length": 15, "width": 20.5, "height": 37, "unit": "mm" },
  "weight": { "value": 14.5, "unit": "g" }
}
\`\`\``,
    },
    dimensionsLength: {
      type: "integer",
      label: "Dimensions Length",
      description: "Length in the specified unit.",
      optional: true,
    },
    dimensionsWidth: {
      type: "integer",
      label: "Dimensions Width",
      description: "Width in the specified unit.",
      optional: true,
    },
    dimensionsHeight: {
      type: "integer",
      label: "Dimensions Height",
      description: "Height in the specified unit.",
      optional: true,
    },
    dimensionsUnit: {
      type: "string",
      label: "Dimensions Unit",
      description: "Unit of the dimensions.",
      options: [
        "cm",
        "mm",
        "m",
        "yd",
        "ft",
        "in",
      ],
      optional: true,
    },
    weightValue: {
      type: "integer",
      label: "Weight Value",
      description: "Weight value in the specified unit.",
    },
    weightUnit: {
      type: "string",
      label: "Weight Unit",
      description: "Unit of the weight.",
      options: [
        "kg",
        "g",
        "lbs",
        "oz",
      ],
    },
    brandDomain: {
      type: "string",
      label: "Brand Domain",
      description: "Domain of the brand configured for your return portal (e.g., `my-shop`).",
      async options({
        mapper = ({
          id: value,
          name: label,
        }) => ({
          value,
          label,
        }),
      }) {
        const { brands } = await this.listBrands();

        return brands.map(mapper);
      },
    },
    shippingMethodId: {
      type: "string",
      label: "Shipping Method ID",
      description: "The unique identifier of the shipping method",
      async options() {
        const { shipping_methods: data } = await this.listShippingMethods();

        return data.map(({
          id: value,
          name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Excludes all returns before this datetime. Example: `2022-04-06 00:00:00`",
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Excludes all returns after this datetime. Example: `2022-04-07 00:00:00`",
    },
  },
  methods: {
    getMockUrl(path, versionPath = constants.VERSION_PATH.MOCK_V2) {
      return `${constants.MOCK_BASE_URL}${versionPath}${path}`;
    },
    getUrl(path, versionPath = constants.VERSION_PATH.V2, baseUrl = constants.BASE_URL) {
      return `${baseUrl}${versionPath}${path}`;
    },
    getAuth(auth) {
      const {
        public_key: username,
        secret_key: password,
      } = this.$auth;

      return {
        ...auth,
        username,
        password,
      };
    },
    getHeaders(headers) {
      const {
        username,
        password,
      } = this.getAuth();

      const token = Buffer.from(`${username}:${password}`).toString("base64");

      return {
        ...headers,
        Authorization: `Basic ${token}`,
      };
    },
    _makeRequest({
      $ = this,
      path, auth, headers, versionPath,
      mockPath, mockVersionPath,
      baseUrl, hasHeadersAuth = false,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        headers,
        url: constants.USE_MOCK
          ? this.getMockUrl(mockPath, mockVersionPath)
          : this.getUrl(path, versionPath, baseUrl),
        ...(hasHeadersAuth
          ? {
            headers: this.getHeaders(headers),
          }
          : {
            auth: this.getAuth(auth),
          }
        ),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    createParcel(args = {}) {
      return this.post({
        path: "/parcels",
        ...args,
      });
    },
    updateParcel({
      id, ...args
    }) {
      return this.put({
        path: `/parcels/${id}`,
        ...args,
      });
    },
    listParcels(args = {}) {
      return this._makeRequest({
        path: "/parcels",
        mockPath: "/299107074/parcels",
        ...args,
      });
    },
    getParcel({
      parcelId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/parcels/${parcelId}`,
        mockPath: `/299107074/parcels/${parcelId}`,
        ...args,
      });
    },
    listIntegrations(args = {}) {
      return this._makeRequest({
        path: "/integrations",
        mockPath: "/299107069/integrations",
        ...args,
      });
    },
    listIntegrationShipments({
      integrationId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/integrations/${integrationId}/shipments`,
        mockPath: `/299107069/integrations/${integrationId}/shipments`,
        ...args,
      });
    },
    upsertIntegrationShipment({
      integrationId, ...args
    } = {}) {
      return this.post({
        path: `/integrations/${integrationId}/shipments`,
        mockPath: `/299107069/integrations/${integrationId}/shipments`,
        ...args,
      });
    },
    listParcelDocuments({
      type, ...args
    } = {}) {
      return this._makeRequest({
        versionPath: constants.VERSION_PATH.V3,
        mockVersionPath: constants.VERSION_PATH.MOCK_V3,
        path: `/parcel-documents/${type}`,
        mockPath: `/299107072/parcel-documents/${type}`,
        hasHeadersAuth: true,
        paramsSerializer: (params) => {
          return Object.entries(params)
            .map(([
              key,
              value,
            ]) => {
              if (Array.isArray(value)) {
                return value.map((id) => `${key}=${id}`).join("&");
              }
              return `${key}=${value}`;
            })
            .join("&");
        },
        ...args,
      });
    },
    getLabel({
      parcelId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/labels/${parcelId}`,
        mockPath: `/299107071/labels/${parcelId}`,
        ...args,
      });
    },
    bulkPDFLabelPrinting(args = {}) {
      return this.post({
        path: "/labels",
        mockPath: "/299107071/labels",
        ...args,
      });
    },
    listServicePoints(args = {}) {
      return this._makeRequest({
        hasHeadersAuth: true,
        baseUrl: constants.SERVICE_POINTS_BASE_URL,
        path: "/service-points",
        mockPath: "/299107080/service-points",
        ...args,
      });
    },
    getServicePoint({
      servicePointId, ...args
    } = {}) {
      return this._makeRequest({
        hasHeadersAuth: true,
        baseUrl: constants.SERVICE_POINTS_BASE_URL,
        path: `/service-points/${servicePointId}`,
        mockPath: `/299107080/service-points/${servicePointId}`,
        ...args,
      });
    },
    listServicePointCarriers(args = {}) {
      return this._makeRequest({
        hasHeadersAuth: true,
        baseUrl: constants.SERVICE_POINTS_BASE_URL,
        path: "/carriers",
        mockPath: "/299107080/carriers",
        ...args,
      });
    },
    listSenderAddresses(args = {}) {
      return this._makeRequest({
        path: "/user/addresses/sender",
        mockPath: "/299107079/user/addresses/sender",
        ...args,
      });
    },
    getSenderAddress({
      senderAddressId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/user/addresses/sender/${senderAddressId}`,
        mockPath: `/299107079/user/addresses/sender/${senderAddressId}`,
        ...args,
      });
    },
    listParcelStatuses(args = {}) {
      return this._makeRequest({
        versionPath: constants.VERSION_PATH.V3,
        mockVersionPath: constants.VERSION_PATH.MOCK_V3,
        path: "/parcels/statuses",
        mockPath: "/299107073/parcels/statuses",
        ...args,
      });
    },
    listReturns(args = {}) {
      return this._makeRequest({
        versionPath: constants.VERSION_PATH.V3,
        mockVersionPath: constants.VERSION_PATH.MOCK_V3,
        path: "/returns",
        mockPath: "/299107077/returns",
        ...args,
      });
    },
    getReturn({
      returnId, ...args
    } = {}) {
      return this._makeRequest({
        versionPath: constants.VERSION_PATH.V3,
        mockVersionPath: constants.VERSION_PATH.MOCK_V3,
        path: `/returns/${returnId}`,
        mockPath: `/299107077/returns/${returnId}`,
        ...args,
      });
    },
    createReturn(args = {}) {
      return this.post({
        versionPath: constants.VERSION_PATH.V3,
        mockVersionPath: constants.VERSION_PATH.MOCK_V3,
        path: "/returns",
        mockPath: "/299107077/returns",
        ...args,
      });
    },
    validateReturn(args = {}) {
      return this.post({
        versionPath: constants.VERSION_PATH.V3,
        mockVersionPath: constants.VERSION_PATH.MOCK_V3,
        path: "/returns/validate",
        mockPath: "/299107077/returns/validate",
        ...args,
      });
    },
    getReturnPortalSettings({
      brandDomain, ...args
    } = {}) {
      return this._makeRequest({
        path: `/brand/${brandDomain}/return-portal`,
        mockPath: `/299107078/brand/${brandDomain}/return-portal`,
        ...args,
      });
    },
    getCurrentUser(args = {}) {
      return this._makeRequest({
        versionPath: constants.VERSION_PATH.V3,
        mockVersionPath: constants.VERSION_PATH.MOCK_V3,
        path: "/user/auth/metadata",
        mockPath: "/979441214/user/auth/metadata",
        ...args,
      });
    },
    listShippingMethods(args = {}) {
      return this._makeRequest({
        path: "/shipping_methods",
        mockPath: "/299107081/shipping_methods",
        ...args,
      });
    },
    getShippingMethod({
      shippingMethodId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/shipping_methods/${shippingMethodId}`,
        mockPath: `/299107081/shipping_methods/${shippingMethodId}`,
        ...args,
      });
    },
    listBrands(args = {}) {
      return this._makeRequest({
        path: "/brands",
        mockPath: "/299107066/brands",
        ...args,
      });
    },
    async paginate({
      requester,
      requesterArgs = {},
      resultsKey,
      maxRequests = 3,
    } = {}) {
      const results = [];
      let requests = 0;
      let cursor;

      do {
        const response = await requester({
          ...requesterArgs,
          params: {
            ...(requesterArgs.params || {}),
            cursor,
          },
        });

        const items = resultsKey
          ? response[resultsKey]
          : response;

        if (Array.isArray(items)) {
          results.push(...items);
        }

        const next = response?.next;
        if (next) {
          const url = new URL(next);
          cursor = url.searchParams.get("cursor");
        }

        if (typeof maxRequests === "number" && requests >= maxRequests) {
          break;
        }

        requests++;

      } while (cursor);

      return results;
    },
  },
};
