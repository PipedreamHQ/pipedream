import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paazl",
  propDefinitions: {
    reference: {
      type: "string",
      label: "Reference",
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
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "The shipment identifier",
      async options({ orderReference }) {
        if (!orderReference) {
          return [];
        }
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
      async options({
        token, consigneeCountryCode,
      }) {
        const response = await this.getShippingOptions({
          data: {
            token,
            consigneeCountryCode,
          },
        });
        return response?.shippingOptions?.map(({
          identifier: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
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
      description: "The number of days a warehouse needs to get an order ready for pick-up by a carrier (min: `0`, max: `99`)",
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
      description: "The starting point of a range of possible delivery dates (format: `YYYY-MM-DD`)",
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
    pickupLocationAccountNumber: {
      type: "string",
      label: "Pickup Location Account Number",
      description: "An account number that a carrier can issue to customers",
      optional: true,
    },
    orderDescription: {
      type: "string",
      label: "Description",
      description: "A general description of the contents of a shipment",
      optional: true,
    },
    orderWeight: {
      type: "string",
      label: "Weight",
      description: "The total weight in kilograms (kg) of an order, including packaging",
      optional: true,
    },
    requestedDeliveryDate: {
      type: "string",
      label: "Requested Delivery Date",
      description: "The date on which a customer has requested that an order be delivered (format: `YYYY-MM-DD`)",
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
      description: "The invoice date of an order (format: `YYYY-MM-DD`)",
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
      description: "Optional. If Quantity is `1` then one extra label is generated. If Quantity is greater than `1`, extra labels are generated. Mutually exclusive with parcels.",
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
      description: "The ISO 4217 code for the currency (default: `EUR`)",
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
      description: "The ISO 4217 code for the currency (default: `EUR`)",
      optional: true,
      default: "EUR",
    },
    consignee: {
      type: "object",
      label: "Consignee",
      description: `Contains details of the party to which an order is shipped.

**Fields:**
- \`companyName\` (string): The name of a company to which an order is shipped.  
  _Example:_ \`"Bonn Mac Tosch"\`
- \`vatNumber\` (string): The VAT number of the receiver.  
  _Example:_ \`"vat-123456789"\`
- \`email\` (string): The email address of the person to whom an order is shipped.  
  _Example:_ \`"freddie.kwiksilver@konningin.org"\`
- \`name\` (string): The name of the person to whom an order is shipped.  
  _Example:_ \`"Friederich Feuerstein"\`
- \`other\` (string): Additional details used to identify the person to whom an order is shipped.  
  _Example:_ \`"Logistik Manager"\`
- \`phone\` (string): The phone number of the person to whom an order is shipped.  
  _Example:_ \`"+31-20-7736303"\`
- \`locale\` (string): Specifies the language of the email templates used for track & trace notifications.  
  Format: \`{language}_{country}\` (e.g., \`fr_FR\`)
- \`address\` (object): Contains details of the address to which an order is shipped.  
  **Address Fields:**
  - \`city\` (string): The city or town. _Example:_ \`"Bonn"\`
  - \`country\` (string): ISO 3166-2 code. _Example:_ \`"DE"\`
  - \`postalCode\` (string): Postal code. _Example:_ \`"53111"\`
  - \`province\` (string): Province/state code. _Example:_ \`"NW"\`
  - \`street\` (string): Street name. _Example:_ \`"Am Hauptbahnhof"\`
  - \`streetLines\` (array): Additional street lines.
  - \`houseNumber\` (integer): House number. _Example:_ \`9\`
  - \`houseNumberExtension\` (string): House number extension. _Example:_ \`"-A"\`

**Example:**
\`\`\`json
{
  "companyName": "Bonn Mac Tosch",
  "vatNumber": "vat-123456789",
  "email": "freddie.kwiksilver@konningin.org",
  "name": "Friederich Feuerstein",
  "other": "Logistik Manager",
  "phone": "+31-20-7736303",
  "locale": "fr_FR",
  "address": {
    "city": "Bonn",
    "country": "DE",
    "postalCode": "53111",
    "province": "NW",
    "street": "Am Hauptbahnhof",
    "streetLines": ["Am Hauptbahnhof 9"],
    "houseNumber": 9,
    "houseNumberExtension": "-A"
  }
}
\`\`\`
`,
    },
    customsValue: {
      type: "object",
      label: "Customs Value",
      description: `The total monetary value for customs purposes.

**Fields:**
- \`value\` (number): The monetary value of an order for customs purposes.  
  _Example:_ \`40.2\`
- \`currency\` (string): The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) code for the currency.  
  The default code is \`"EUR"\`.  
  _Example:_ \`"USD"\`
- \`description\` (string): The description of the customs value.  
  _Example:_ \`"Customs value description"\`

**Example:**
\`\`\`json
{
  "value": 40.2,
  "currency": "USD",
  "description": "Customs value description"
}
\`\`\`
`,
      optional: true,
    },
    insuredValue: {
      type: "object",
      label: "Insured Value",
      description: `The amount for which this order is insured by the carrier against loss, damage, or accident during transport.

**Fields:**
- \`value\` (number): The amount of insurance coverage requested from the carrier.  
  _Example:_ \`500.0\`
- \`currency\` (string): The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) code for the currency.  
  The default code is \`"EUR"\`.  
  _Example:_ \`"USD"\`
- \`description\` (string): The description of the insured value.  
  _Example:_ \`"Insured value description"\`

**Example:**
\`\`\`json
{
  "value": 500.0,
  "currency": "USD",
  "description": "Insured value description"
}
\`\`\`
`,
      optional: true,
    },
    codValue: {
      type: "object",
      label: "COD Value",
      description: `The amount that a consignee has to pay before receiving the "Cash On Delivery" consignment.

**Fields:**
- \`value\` (number): The amount that has to be paid by receiver before receiving the goods.  
  _Example:_ \`40.2\`
- \`currency\` (string): The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) code for the currency.  
  The default code is \`"EUR"\`.  
  _Example:_ \`"USD"\`
- \`description\` (string): The description of the COD value.  
  _Example:_ \`"COD value description"\`

**Example:**
\`\`\`json
{
  "value": 40.2,
  "currency": "USD",
  "description": "COD value description"
}
\`\`\`
`,
      optional: true,
    },
    products: {
      type: "string[]",
      label: "Products",
      description: `Contains objects representing the products making up an order.

**Fields:**
- \`height\` (integer): The height of a product, in centimeters (cm).  
  _Example:_ \`10\`
- \`length\` (integer): The length of a product, in centimeters (cm).  
  _Example:_ \`30\`
- \`unitPrice\` (object): The value of a product.  
  - \`value\` (number): The monetary value of a product. _Example:_ \`40.2\`  
  - \`currency\` (string): The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) code for the currency. Default: \`"EUR"\`. _Example:_ \`"USD"\`
  - \`description\` (string): The description of the product. _Example:_ \`"Zhitomir socks"\`
- \`quantity\` (integer, required): The number of items of a product in a shipment.  
  _Example:_ \`7\`
- \`volume\` (number): The volume of a product, including packaging, in cubic meters (m³).  
  _Example:_ \`0.015625\`
- \`weight\` (number): The weight of a product, in kilograms (kg).  
  _Example:_ \`100\`
- \`width\` (integer): The width of a product, in centimeters (cm).  
  _Example:_ \`20\`
- \`countryOfManufacture\` (string): The [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for the country in which a product was manufactured.  
  _Example:_ \`"DE"\`
- \`description\` (string): A description of the contents of a specific product.  
  _Example:_ \`"Zhitomir socks"\`
- \`hsTariffCode\` (string): The import Harmonized System code of a product.  
  _Example:_ \`"62034231"\`
- \`skuCode\` (string): The SKU code of a product.  
  _Example:_ \`"8754-124-990"\` or \`"KS944RUR"\`

**Example:**
\`\`\`json
[
  {
    "height": 10,
    "length": 30,
    "unitPrice": {
      "value": 40.2,
      "currency": "USD",
      "description": "Zhitomir socks"
    },
    "quantity": 7,
    "volume": 0.015625,
    "weight": 100,
    "width": 20,
    "countryOfManufacture": "DE",
    "description": "Zhitomir socks",
    "hsTariffCode": "62034231",
    "skuCode": "8754-124-990"
  }
]
\`\`\`
`,
      optional: true,
    },
    returnProp: {
      type: "object",
      label: "Return Address",
      description: `Contains the details of an address to which an order is returned.

**Fields:**
- \`description\` *(string)*: The description of the return address.  
  Example: \`"Return address description"\`
- \`name\` *(string)*: The name of the party to which an order is returned.  
  Example: \`"A'dam Mac Tosch"\`
- \`address\` *(object)*: Contains details of the address to which an order is returned.  
  - \`city\` *(string, required if address is provided)*: The city or town.  
    Example: \`"Bonn"\`
  - \`country\` *(string)*: ISO 3166-2 code for the country.  
    Example: \`"DE"\`
  - \`postalCode\` *(string)*: Postal code.  
    Example: \`"53111"\`
  - \`province\` *(string)*: Last 2 letters of the ISO 3166-2 code for the province/state.  
    Example: \`"NW"\`
  - \`street\` *(string)*: Name of the street.  
    Example: \`"Jacob Bontousplaats"\`
  - \`streetLines\` *(array of strings)*: Street name and house number, one or more strings.  
    Example: \`["Jacob Bontiusplaats 9", "Unit 580"]\`
  - \`houseNumber\` *(integer)*: House number.  
    Example: \`9\`
  - \`houseNumberExtension\` *(string)*: House number extension (e.g., "-A").  
    Example: \`"-A"\`

**Example:**
\`\`\`json
{
  "description": "Return address description",
  "name": "A'dam Mac Tosch",
  "address": {
    "city": "Bonn",
    "country": "DE",
    "postalCode": "53111",
    "province": "NW",
    "street": "Jacob Bontiusplaats",
    "streetLines": ["Jacob Bontiusplaats 9", "Unit 580"],
    "houseNumber": 9,
    "houseNumberExtension": "-A"
  }
}
\`\`\`
`,
      optional: true,
    },
    sender: {
      type: "object",
      label: "Sender",
      description: `Contains the details of the address from which an order is shipped.

**Fields:**
- \`description\` *(string)*: The description of the sender address.  
  Example: \`"Sender address description"\`
- \`name\` *(string)*: The name of the party that shipped an order.  
  Example: \`"A'dam Mac Tosch"\`
- \`address\` *(object, required if provided)*: Contains details of the address from which an order is shipped.  
  - \`city\` *(string, required if address is provided)*: The city or town from which an order is shipped.  
    Example: \`"Bonn"\`
  - \`country\` *(string)*: ISO 3166-2 code for the country.  
    Example: \`"DE"\`
  - \`postalCode\` *(string)*: Postal code.  
    Example: \`"53111"\`
  - \`province\` *(string)*: Last 2 letters of the ISO 3166-2 code for the province/state.  
    Example: \`"NW"\`
  - \`street\` *(string)*: Name of the street.  
    Example: \`"John Plagis Avenue"\`
  - \`streetLines\` *(array of strings)*: Street name and house number, one or more strings.  
    Example: \`["6 John Plagis Avenue", "Around the corner"]\`
  - \`houseNumber\` *(integer)*: House number.  
    Example: \`6\`
  - \`houseNumberExtension\` *(string)*: House number extension (e.g., "-A").  
    Example: \`"-A"\`

**Note:**  
If not provided, the default value is the address specified in your web app account under **Settings > Account > My address book > Sender address**.

**Example:**
\`\`\`json
{
  "description": "Sender address description",
  "name": "A'dam Mac Tosch",
  "address": {
    "city": "Bonn",
    "country": "DE",
    "postalCode": "53111",
    "province": "NW",
    "street": "John Plagis Avenue",
    "streetLines": ["6 John Plagis Avenue", "Around the corner"],
    "houseNumber": 6,
    "houseNumberExtension": "-A"
  }
}
\`\`\`
`,
      optional: true,
    },
    shipping: {
      type: "object",
      label: "Shipping",
      description: `Contains information on the shipping option selected by a customer.

**Fields:**
- \`option\` *(string, required)*: A shipping option's Paazl identifier.  
  Example: \`"AVG"\`

- \`pickupLocation\` *(object, optional)*: If your customer selected a pickup location at checkout, this object contains information on that location.  
  - \`description\` *(string, optional)*: The description of the pickup location.  
    Example: \`"Pickup location description"\`
  - \`accountNumber\` *(string, optional)*: An account number that a carrier can issue to customers for managing delivery of their parcel to a collection point.  
  - \`code\` *(string, required if pickupLocation is provided)*: A carrier's unique code for a pickup location.  
    Example: \`"NOP12345"\`

- \`contract\` *(string, optional)*: The identification code of your carrier contract for an outbound shipment.  
  Example: \`"XYZ123"\`

- \`returnContract\` *(string, optional)*: The identification code of your carrier contract for a return shipment.  
  Example: \`"321ZYX"\`

- \`packageCount\` *(integer, optional)*: The number of packages in a shipment.  
  Example: \`3\`

- \`multiPackageShipment\` *(boolean, optional)*: If true, Paazl will treat the shipment as consolidated.  
  Example: \`false\`

**Example:**
\`\`\`json
{
  "option": "AVG",
  "pickupLocation": {
    "description": "Pickup location description",
    "accountNumber": "123456789",
    "code": "NOP12345"
  },
  "contract": "XYZ123",
  "returnContract": "321ZYX",
  "packageCount": 3,
  "multiPackageShipment": false
}
\`\`\`
`,
    },
  },
  methods: {
    getUrl(path) {
      const { environment: baseUrl } = this.$auth;
      return `${baseUrl}/v1${path}`;
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
