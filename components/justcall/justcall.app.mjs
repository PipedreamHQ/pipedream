import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "justcall",
  propDefinitions: {
    from: {
      type: "string",
      label: "From",
      description: "JustCall SMS capabled number in E.164 format - ex +14155552671.",
      async options() {
        const { data } = await this.listPhoneNumbers({
          params: {
            capabilities: "sms",
          },
        });

        return data.map(({ justcall_number: value }) => value);
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.justcall.io/v2.1${path}`;
    },
    _getHeaders() {
      return {
        "Authorization": `${this.$auth.api_key}:${this.$auth.api_secret}`,
        "Accept": "application/json",
        "x-justcall-client": "@PipedreamHQ/pipedream v0.1",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: this.getUrl(path),
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...args,
      });
    },
    listPhoneNumbers(args = {}) {
      return this._makeRequest({
        path: "/phone-numbers",
        ...args,
      });
    },
    sendTextMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/texts/new",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...args,
      });
    },
    deleteHook({
      urlId, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/url/${urlId}`,
        ...args,
      });
    },
  },
};
