import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "trestle",
  propDefinitions: {
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
      optional: true,
    },
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "The IP address associated with the contact",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact",
      optional: true,
    },
    stateCode: {
      type: "string",
      label: "State Code",
      description: "The two-letter state or province code",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal or ZIP code",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The two-letter country code",
      options: constants.COUNTRY_CODES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.trestleiq.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          api_key: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },
    async phoneValidation(args = {}) {
      return this._makeRequest({
        path: "/3.0/phone_intel/",
        ...args,
      });
    },
    async realContact(args = {}) {
      return this._makeRequest({
        path: "/1.1/real_contact",
        ...args,
      });
    },
    async reversePhone(args = {}) {
      return this._makeRequest({
        path: "/3.2/phone",
        ...args,
      });
    },
  },
};
