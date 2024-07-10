import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "_2chat",
  propDefinitions: {
    fromNumber: {
      type: "string",
      label: "From Phone Number",
      description: "The WhatsApp number that you connected to 2Chat",
      async options() {
        const { numbers } = await this.listPhoneNumbers();
        return numbers.map(({
          phone_number: value, friendly_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.p.2chat.io/open";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-User-API-Key": `${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    createWebhook({
      event, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/subscribe/${event}`,
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
        ...opts,
      });
    },
    listPhoneNumbers(opts = {}) {
      return this._makeRequest({
        path: "/whatsapp/get-numbers",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        path: "/whatsapp/send-message",
        method: "POST",
        ...opts,
      });
    },
    checkWhatsAppAccount({
      fromNumber, numberToCheck, ...opts
    }) {
      return this._makeRequest({
        path: `/whatsapp/check-number/${fromNumber}/${numberToCheck}`,
        ...opts,
      });
    },
  },
};
