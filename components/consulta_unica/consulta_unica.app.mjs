import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "consulta_unica",
  propDefinitions: {
    curp: {
      type: "string",
      label: "CURP",
      description: "Mexican Unique Population Registry Code (CURP). Must be exactly 18 characters.",
    },
    rfc: {
      type: "string",
      label: "RFC",
      description: "Mexican Federal Taxpayer Registry (RFC). Maximum 13 characters.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Mexican phone number. Must be exactly 10 digits.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://consultaunica.mx/api/v3";
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        method: "POST",
        ...opts,
      });
    },
    validateRfc(opts = {}) {
      return this._makeRequest({
        path: "/sat",
        ...opts,
      });
    },
    lookupPhone(opts = {}) {
      return this._makeRequest({
        path: "/phones",
        ...opts,
      });
    },
    getAforeDetails(opts = {}) {
      return this._makeRequest({
        path: "/afore",
        ...opts,
      });
    },
  },
};
