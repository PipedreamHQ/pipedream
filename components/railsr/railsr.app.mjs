import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "railsr",
  propDefinitions: {
    id: {
      type: "string",
      label: "Enduser ID",
      description: "ID of the Enduser",
      async options() {
        const response = await this.listEndusers();
        const endusersIds = response.endusers;
        return endusersIds.map(({
          enduserId, firstName, lastName,
        }) => ({
          value: enduserId,
          label: `${firstName} ${lastName}`,
        }));
      },
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code, using ISO 3166-1 alpha-2",
      options: constants.COUNTRY_CODES,
    },
    accountUsage: {
      type: "string[]",
      label: "Account Usage",
      description: "Array of account usage types",
      options: constants.ACCOUNT_USAGE,
    },
    citizenships: {
      type: "string[]",
      label: "Citizenships",
      description: "Array of countries where the person holds citizenship, using ISO 3166-1 alpha-2",
      options: constants.COUNTRY_CODES,
    },
    riskScore: {
      type: "string",
      label: "Risk Score",
      description: "Assessed risk level of the enduser",
      options: constants.RISK_SCORES,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Enduser's last name",
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "Date of birth in ISO 8601 format (YYYY-MM-DD)",
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Enduser's gender",
      options: constants.GENDERS,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address. Must be a valid email",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Enduser's first name. Minimum of 1 character, maximum of 200 characters",
    },
    telephone: {
      type: "string",
      label: "Telephone",
      description: "Phone number. Cannot start with 0 and should not contain the '+' sign",
    },
    isPep: {
      type: "boolean",
      label: "Is Politically Exposed Person",
      description: "Indicates if the associated person is a Politically Exposed Person",
    },
    accountRange: {
      type: "string",
      label: "Account Range",
      description: "Range of the expected transaction volumes",
      options: constants.ACCOUNT_RANGES,
    },
    accountCurrency: {
      type: "string",
      label: "Account Currency",
      description: "Currency of expected transaction volumes",
      options: constants.ACCOUNT_CURRENCIES,
    },
    houseNumber: {
      type: "string",
      label: "House Number",
      description: "House number or building name of residence.",
    },
    street: {
      type: "string",
      label: "Street",
      description: "Street name of residence.",
    },
    city: {
      type: "string",
      label: "City",
      description: "City of residence.",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of residence.",
    },
    residentialCountry: {
      type: "string",
      label: "Country",
      description: "Country code, using ISO 3166-1 alpha-2",
      options: constants.COUNTRY_CODES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://play.railsbank.com/v2";
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
          ...headers,
          "Authorization": `API-Key ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createEnduser(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/endusers",
        ...args,
      });
    },
    async getEnduser({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/endusers/${id}`,
        ...args,
      });
    },
    async updateEnduser({
      id, ...args
    }) {
      return this._makeRequest({
        method: "put",
        path: `/endusers/${id}`,
        ...args,
      });
    },
    async listEndusers(args = {}) {
      return this._makeRequest({
        path: "/endusers",
        ...args,
      });
    },
  },
};
