import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "usps",
  propDefinitions: {
    organizationDetails: {
      type: "object",
      label: "Organization Details",
      description: "Details of the organization to register with USPS",
    },
    zipCode: {
      type: "string",
      label: "ZIP Code",
      description: "ZIP Code to find acceptable entry locations",
    },
    packageRateIngredients: {
      type: "object",
      label: "Package Rate Ingredients",
      description: "The set of package rate ingredients to calculate the eligible price",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.usps.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async registerOrganization({ organizationDetails }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/organizations",
        data: organizationDetails,
      });
    },
    async getDropOffLocation({ zipCode }) {
      return this._makeRequest({
        method: "GET",
        path: `/v1/dropoff-location/${zipCode}`,
      });
    },
    async getLetterRates({ packageRateIngredients }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/letter-rates/search",
        data: packageRateIngredients,
      });
    },
  },
  version: "0.0.{{ts}}",
};
