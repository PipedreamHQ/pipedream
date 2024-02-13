import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dopplerai",
  propDefinitions: {
    messageText: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to send to the AI",
      required: true,
    },
    collectionName: {
      type: "string",
      label: "Collection Name",
      description: "The name of the new collection",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility of the new collection",
      optional: true,
      options: [
        "public",
        "private",
      ],
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.dopplerai.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async initializeChat() {
      return this._makeRequest({
        method: "POST",
        path: "/chats",
      });
    },
    async dispatchMessage(messageText) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        data: {
          message: messageText,
        },
      });
    },
    async establishCollection(collectionName, visibility) {
      return this._makeRequest({
        method: "POST",
        path: "/collections",
        data: {
          name: collectionName,
          visibility: visibility,
        },
      });
    },
  },
};
