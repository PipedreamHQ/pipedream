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
    value: {
      type: "any",
      label: "Value X",
      description: "The value to pass to the webhook trigger",
      optional: true,
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
        method: "post",
        ...opts,
      });
    },
    async _callWebhook({
      $, url, data,
    }) {
      const opts = {
        url,
        data,
      };
      return this._makeRequest({
        $,
        opts,
      });
    },
    async callWebhookWithJSON({
      $, webhookKey, eventName, data,
    }) {
      const url = encodeURI(`https://maker.ifttt.com/trigger/${eventName}/json/with/key/${webhookKey}`);
      return this._callWebhook({
        $,
        url,
        data,
      });
    },
    async callWebhookWithValues({
      $, webhookKey, eventName, data,
    }) {
      const url = encodeURI(`https://maker.ifttt.com/trigger/${eventName}/with/key/${webhookKey}`);
      return this._callWebhook({
        $,
        url,
        data,
      });
    },
  },
};
