import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "frontegg",
  propDefinitions: {
    type: {
      type: "string",
      label: "Template Type",
      description: "Select the type of email template you want to create or update.",
      options: constants.TYPES,
    },
    senderEmail: {
      type: "string",
      label: "Sender Email",
      description: "The email address of the sender.",
      optional: true,
    },
    redirectURL: {
      type: "string",
      label: "Redirect URL",
      description: "The URL where users will be redirected (required for specific template types).",
      optional: true,
    },
    htmlTemplate: {
      type: "string",
      label: "HTML Template",
      description: "The HTML content of the email template.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email.",
      optional: true,
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "The name that will appear as the sender of the email.",
      optional: true,
    },
    successRedirectUrl: {
      type: "string",
      label: "Success Redirect URL",
      description: "The URL where users will be redirected after a successful operation.",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Set the template status to active or inactive.",
      optional: true,
    },
    sendGridSecretKey: {
      type: "string",
      label: "SendGrid Secret Key",
      description: "Your SendGrid secret key for sending emails.",
      optional: true,
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.geo_location}.frontegg.com`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createOrUpdateTemplate(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/identity/resources/mail/v1/configs/templates",
        ...args,
      });
    },
    async createOrUpdateConfiguration(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/identity/resources/mail/v1/configurations",
        ...args,
      });
    },
  },
};
