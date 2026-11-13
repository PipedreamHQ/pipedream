import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "proweblook",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to verify, e.g. `person@example.com`.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number in international E.164 format, e.g. `+12025550123`, or national format paired with `countryCode`, e.g. `2025550123`.",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Optional two-letter uppercase ISO 3166-1 alpha-2 country code used when `phoneNumber` is provided without a `+` prefix, e.g. `US`, `GB`, or `IN`. Leave blank when `phoneNumber` is already in E.164 format.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://proweblook.com/api/v1/zapier";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      data = {},
      ...otherOpts
    } = {}) {
      const response = await axios($, {
        method: "POST",
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          ...headers,
        },
        data,
        ...otherOpts,
      });
      if (response?.ok === false) {
        const message = response.error?.message || "ProWebLook API returned an error.";
        const code = response.error?.code;
        throw new Error(
          code
            ? `${message} (${code})`
            : message,
        );
      }
      return response;
    },
    getBalance(opts = {}) {
      return this._makeRequest({
        path: "/get_balance",
        ...opts,
      });
    },
    verifyEmail(opts = {}) {
      return this._makeRequest({
        path: "/verify_email",
        ...opts,
      });
    },
    validatePhone(opts = {}) {
      return this._makeRequest({
        path: "/validate_phone",
        ...opts,
      });
    },
    checkWhatsapp(opts = {}) {
      return this._makeRequest({
        path: "/check_whatsapp",
        ...opts,
      });
    },
  },
};
