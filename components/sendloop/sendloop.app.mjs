import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendloop",
  propDefinitions: {
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the subscriber.",
      required: true,
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list to which the subscriber will be added or removed from.",
      required: true,
    },
    bounceStatus: {
      type: "string",
      label: "Bounce Status",
      description: "The bounce status of the subscriber.",
      optional: true,
    },
    addedTime: {
      type: "string",
      label: "Added Time",
      description: "The time when the subscriber was added.",
      optional: true,
    },
    emailSubject: {
      type: "string",
      label: "Email Subject",
      description: "The subject of the email opened by the subscriber.",
      optional: true,
    },
    openTime: {
      type: "string",
      label: "Open Time",
      description: "The time when the email was opened by the subscriber.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sendloop.com";
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
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async addSubscriber(emailAddress, listId) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/subscribers`,
        data: {
          emailAddress,
        },
      });
    },
    async removeSubscriber(emailAddress, listId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/lists/${listId}/subscribers/${emailAddress}`,
      });
    },
    async getSubscriber(emailAddress, listId) {
      return this._makeRequest({
        method: "GET",
        path: `/lists/${listId}/subscribers/${emailAddress}`,
      });
    },
    async getSubscribers(listId) {
      return this._makeRequest({
        method: "GET",
        path: `/lists/${listId}/subscribers`,
      });
    },
    async getSubscriberEvents(emailAddress, listId) {
      return this._makeRequest({
        method: "GET",
        path: `/lists/${listId}/subscribers/${emailAddress}/events`,
      });
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
