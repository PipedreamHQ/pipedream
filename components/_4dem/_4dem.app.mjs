import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "_4dem",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the sender",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address",
    },
    nominative: {
      type: "string",
      label: "Nominative",
      description: "Sender nominativa, i.e. `My Company`",
    },
    ivaFCode: {
      type: "string",
      label: "IVA Code",
      description: "Sender IVA code, i.e. `IT123456789`",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Sender address, i.e. `Via Roma 1`",
    },
    city: {
      type: "string",
      label: "City",
      description: "Sender city, i.e. `Torino`",
    },
    province: {
      type: "string",
      label: "Province",
      description: "Abbreviation of the province, i.e. `TO`",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Sender country, i.e. `Italia`",
    },
    cap: {
      type: "string",
      label: "Postal Code",
      description: "Sender postal code, i.e. `10100`",
    },
    telephone: {
      type: "string",
      label: "Telephone",
      description: "Telephone number, i.e.`+393331234567`",
    },
    senderId: {
      type: "string",
      label: "Sender ID",
      description: "ID of the sender",
      async options() {
        const { data: sendersIds } = await this.getSenders();

        return sendersIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    authCode: {
      type: "string",
      label: "Auth Code",
      description: "Authenticator code sent to the provided email",
    },
    subject: {
      type: "string",
      label: "Email Subject",
      description: "Subject of the email",
    },
    plain: {
      type: "string",
      label: "Plain Content",
      description: "Plain content of the email",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML Content",
      description: "HTML content of the email",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.4dem.it";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createSender(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/senders/email",
        ...args,
      });
    },
    async confirmEmail({
      senderId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/senders/email/${senderId}/confirm`,
        ...args,
      });
    },
    async createEmail(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/contents/emails",
        ...args,
      });
    },
    async getSenders(args = {}) {
      return this._makeRequest({
        path: "/senders/email",
        ...args,
      });
    },
  },
};
