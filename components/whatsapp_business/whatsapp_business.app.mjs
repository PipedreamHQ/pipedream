import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whatsapp_business",
  propDefinitions: {
    phoneNumberId: {
      type: "string",
      label: "Phone Number ID",
      description: "Phone number ID that will be used to send the message",
      async options() {
        const { data: numbers } = await this.getPhoneNumberId();
        return numbers.map(({
          verified_name, display_phone_number, id,
        }) => ({
          label: `${verified_name}: +${display_phone_number}`,
          value: id,
        }));
      },
    },
  },
  methods: {
    _businessAccountId() {
      return this.$auth.business_account_id;
    },
    _auth() {
      return this.$auth.oauth_access_token;
    },
    _version() {
      return "v15.0";
    },
    _baseUrl() {
      return `https://graph.facebook.com/${this._version()}`;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}` + path,
        headers: {
          "Authorization": `Bearer ${this._auth()}`,
          "Content-Type": "application/json",
        },
      });
    },
    async getPhoneNumberId(opts = {}) {
      const path = `/${this._businessAccountId()}/phone_numbers`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async sendMessage({
      $, phoneNumberId, to, body, ...opts
    }) {
      const path = `/${phoneNumberId}/messages`;
      return this._makeRequest({
        ...opts,
        $,
        path,
        method: "post",
        data: {
          ...opts.data,
          to,
          messaging_product: "whatsapp",
          recipient_type: "individual",
          type: "text",
          text: {
            preview_url: false,
            body,
          },
        },
      });
    },
  },
};
