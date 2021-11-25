const axios = require("axios");
const updateTypes = [
  {
    label: "Message",
    value: "message",
  },
  {
    label: "Edited Message",
    value: "edited_message",
  },
  {
    label: "Channel Post",
    value: "channel_post",
  },
  {
    label: "Edited Channel Post",
    value: "edited_channel_post",
  },
  {
    label: "Inline Query",
    value: "inline_query",
  },
  {
    label: "Chosen Inline Result",
    value: "chosen_inline_result",
  },
  {
    label: "Callback Query",
    value: "callback_query",
  },
  {
    label: "Shipping Query",
    value: "shipping_query",
  },
  {
    label: "Pre Checkout Query",
    value: "pre_checkout_query",
  },
  {
    label: "Poll",
    value: "poll",
  },
  {
    label: "Poll Answer",
    value: "poll_answer",
  },
];

module.exports = {
  type: "app",
  app: "telegram_bot_api",
  propDefinitions: {
    updateTypes: {
      type: "string[]",
      label: "Update Types",
      optional: true,
      description:
        "Only emit events for the selected update types.",
      options: updateTypes,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://api.telegram.org/bot${this.$auth.token}`;
    },
    _getHeaders() {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    async createHook(url, allowedUpdates) {
      const config = {
        method: "POST",
        url: `${this._getBaseUrl()}/setWebhook`,
        headers: this._getHeaders(),
        data: {
          url: `${url}/${this.$auth.token}`,
          allowed_updates: allowedUpdates,
        },
      };
      return await axios(config);
    },
    async deleteHook() {
      const config = {
        method: "GET",
        url: `${await this._getBaseUrl()}/deleteWebhook`,
        headers: await this._getHeaders(),
      };
      return await axios(config);
    },
  },
};
