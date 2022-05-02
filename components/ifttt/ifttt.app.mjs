import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ifttt",
  propDefinitions: {
    webhookKey: {
      type: "string",
      label: "Webhook Key",
      description: "The webhook key obtained in [Webhook Settings](https://ifttt.com/maker_webhooks/settings)",
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The event name associated with your applet",
    },
    data: {
      type: "object",
      label: "JSON Payload",
      description: "A JSON payload to be sent",
    },
    method: {
      type: "string",
      label: "HTTP Method",
      description: "The HTTP method to be used. Defaults to `post`",
      options: [
        "get",
        "post",
      ],
      optional: true,
      default: "post",
    },
  },
  methods: {
    _defaultHeaders() {
      return {
        "IFTTT-Service-Key": this.$auth.ifttt_Service_Key,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $, opts,
    }) {
      return axios($ ?? this, {
        headers: this._defaultHeaders(),
        ...opts,
      });
    },
    async _callWebhook({
      $, url, method, data,
    }) {
      const opts = {
        url,
        method,
        data,
      };
      return this._makeRequest({
        $,
        opts,
      });
    },
    async callWebhookWithJSON({
      $, webhookKey, eventName, method, data,
    }) {
      const url = encodeURI(`https://maker.ifttt.com/trigger/${eventName}/json/with/key/${webhookKey}`);
      return this._callWebhook({
        $,
        url,
        method,
        data,
      });
    },
  },
};
