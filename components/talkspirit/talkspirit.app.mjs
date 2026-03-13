import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "talkspirit",
  methods: {
    _token() {
      return this.$auth.api_key;
    },
    async sendIncomingWebhook({
      $ = this, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: `https://webhook.talkspirit.com/v1/incoming/${this._token()}`,
        headers: {
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
  },
};
