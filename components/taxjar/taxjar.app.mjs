import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "taxjar",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Unique identifier for the customer",
    },
    exemptionType: {
      type: "string",
      label: "Exemption Type",
      description: "The type of tax exemption for the customer",
      options: constants.EXEMPTION_TYPES,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The two-letter ISO country code, i.e.: `US`",
    },
    state: {
      type: "string",
      label: "State",
      description: "The two-letter ISO state code, i.e.: `CA`",
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The ZIP code of the customer's primary address, i.e.: `92093`",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the customer's primary address, i.e.: `La Jolla`",
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street of the customer's primary address, i.e.: `9500 Gilman Drive`",
    },
    fromCountry: {
      type: "string",
      label: "From Country",
      description: "The two-letter ISO country code of the country where the order shipped from, i.e.: `US`",
    },
    fromZip: {
      type: "string",
      label: "From Zip",
      description: "The postal code where the order shipped from, i.e.: `92093`",
    },
    fromState: {
      type: "string",
      label: "From State",
      description: "The two-letter ISO state code where the order shipped from, i.e.: `CA`",
    },
    fromCity: {
      type: "string",
      label: "From City",
      description: "The city where the order shipped from, i.e.: `La Jolla`",
    },
    fromStreet: {
      type: "string",
      label: "From Street",
      description: "The street address where the order shipped from, i.e.: `9500 Gilman Drive`",
    },
    toCountry: {
      type: "string",
      label: "To Country",
      description: "The two-letter ISO country code of the country where the order shipped to, i.e.: `US`",
    },
    toZip: {
      type: "string",
      label: "To Zip",
      description: "The postal code where the order shipped to, i.e.: `92093`",
    },
    toState: {
      type: "string",
      label: "To State",
      description: "The two-letter ISO state code where the order shipped yo, i.e.: `CA`",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Total amount of the order, excluding shipping",
    },
    shipping: {
      type: "string",
      label: "Shipping",
      description: "Total amount of shipping for the order",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.taxjar.com/v2";
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
          Authorization: `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async createCustomer(args = {}) {
      return this._makeRequest({
        path: "/customers",
        method: "post",
        ...args,
      });
    },
    async calculateSalesTax(args = {}) {
      return this._makeRequest({
        path: "/taxes",
        method: "post",
        ...args,
      });
    },
    async validateAddress(args = {}) {
      return this._makeRequest({
        path: "/addresses/validate",
        method: "post",
        ...args,
      });
    },
  },
};
