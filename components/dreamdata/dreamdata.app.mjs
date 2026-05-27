import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dreamdata",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "Unique identifier for the user in your database. Either a **User ID** or an **Anonymous ID** is required.",
      optional: true,
    },
    anonymousId: {
      type: "string",
      label: "Anonymous ID",
      description: "A pseudo-unique substitute for a User ID, for cases when you don't have an absolutely unique identifier. Either a **User ID** or an **Anonymous ID** is required.",
      optional: true,
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "A unique identifier for this message. Defaults to a generated UUID if omitted. Use a deterministic value to make calls idempotent. Example: `msg_order_2026_05_27_0001`.",
      optional: true,
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "[ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp when the event took place. Defaults to the current time if omitted. Example: `2026-05-27T17:32:11.318Z`.",
      optional: true,
    },
    context: {
      type: "object",
      label: "Context",
      description: "Dictionary of extra information about the message that is not directly related to the API call, such as IP address, user agent, page, or campaign UTM parameters. Example: `{ \"ip\": \"203.0.113.1\", \"userAgent\": \"Mozilla/5.0\", \"page\": { \"url\": \"https://example.com/pricing\" }, \"campaign\": { \"utm_source\": \"google\" } }`. See [Segment-compatible context spec](https://developer.dreamdata.io/server-side/server-side-tracking/).",
      optional: true,
    },
    integrations: {
      type: "object",
      label: "Integrations",
      description: "Dictionary of downstream destinations to either enable or disable for this event. Example: `{ \"all\": false, \"Google Analytics\": true, \"HubSpot\": false }`.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dreamdata.cloud/v1";
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...args,
      });
    },
    sendBatch({
      events, sentAt, messageId, ...args
    } = {}) {
      const data = {
        batch: events,
      };
      if (sentAt) data.sentAt = sentAt;
      if (messageId) data.messageId = messageId;
      return this._makeRequest({
        method: "POST",
        path: "/batch",
        data,
        ...args,
      });
    },
    sendEvent({
      event, ...args
    } = {}) {
      return this.sendBatch({
        events: [
          event,
        ],
        ...args,
      });
    },
    constants() {
      return constants;
    },
  },
};
