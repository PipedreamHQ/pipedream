import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ably",
  propDefinitions: {
    channelName: {
      label: "Channel Name",
      description: "The channel name",
      type: "string",
    },
    eventName: {
      label: "Event Name",
      description: "The event name",
      type: "string",
    },
    messageData: {
      label: "Message Data",
      description: "The data of the message",
      type: "string",
    },
  },
  methods: {
    _apiKeyInitial() {
      return this.$auth.api_key_initial;
    },
    _apiKeyRemaining() {
      return this.$auth.api_key_remaining;
    },
    _apiUrl() {
      return "https://rest.ably.io";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._apiKeyInitial(),
          password: this._apiKeyRemaining(),
        },
        ...args,
      });
    },
    async publishMessage({
      channelName, ...args
    }) {
      return this._makeRequest({
        path: `/channels/${channelName}/messages`,
        method: "post",
        ...args,
      });
    },
  },
};
