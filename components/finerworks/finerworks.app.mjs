import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "finerworks",
  propDefinitions: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "Recipient first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Recipient last name",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Recipient company name",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Street address for the recipient",
    },
    city: {
      type: "string",
      label: "City",
      description: "Recipient city",
      optional: true,
    },
    stateCode: {
      type: "string",
      label: "State Code",
      description: "Required if in U.S. A valid USPS recognized 2 digit state code, i.e.: `CA`",
      optional: true,
    },
    province: {
      type: "string",
      label: "Province",
      description: "Province or region name",
      optional: true,
    },
    zipPostalCode: {
      type: "string",
      label: "ZIP or Postal Code",
      description: "ZIP or postal code of the recipient",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Two-letter ISO country code, e.g.: `US`, `CA`, `GB`",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Recipient phone number",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Recipient email address",
      optional: true,
    },
    productQty: {
      type: "integer",
      label: "Product Quantity",
      description: "Quantity of the product",
    },
    productSku: {
      type: "string",
      label: "Product SKU",
      description: "SKU identifier of the product",
      async options() {
        const response = await this.getProducts();
        const products = response.products;
        return products.map(({
          sku, name,
        }) => ({
          label: name,
          value: sku,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://v2.api.finerworks.com/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "web_api_key": `${this.$auth.web_api_key}`,
          "app_key": `${this.$auth.app_key}`,
          ...headers,
        },
      });
    },
    async validateAddress(args = {}) {
      return this._makeRequest({
        path: "/validate_recipient_address",
        method: "post",
        ...args,
      });
    },
    async getPrices(args = {}) {
      return this._makeRequest({
        path: "/get_prices",
        method: "post",
        ...args,
      });
    },
    async getProductDetails(args = {}) {
      return this._makeRequest({
        path: "/get_product_details",
        method: "post",
        ...args,
      });
    },
    async getProducts(args = {}) {
      return this._makeRequest({
        path: "/list_virtual_inventory",
        method: "post",
        data: {},
        ...args,
      });
    },
  },
};
