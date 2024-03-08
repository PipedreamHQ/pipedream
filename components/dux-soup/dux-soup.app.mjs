import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "linkedin",
  propDefinitions: {
    targetProfileId: {
      type: "string",
      label: "Target Profile ID",
      description: "The ID of the LinkedIn profile you want to target",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to be sent",
      optional: true,
    },
    connectionInfo: {
      type: "object",
      label: "Connection Info",
      description: "Information about the new connection",
      optional: true,
    },
    dateAdded: {
      type: "string",
      label: "Date Added",
      description: "The date the connection was added",
      optional: true,
    },
    messageSource: {
      type: "string",
      label: "Message Source",
      description: "The source of the received LinkedIn message",
      optional: true,
    },
    actionId: {
      type: "string",
      label: "Action ID",
      description: "The ID of the action to monitor",
      optional: true,
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The type of LinkedIn message to monitor",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to the targeted LinkedIn profile",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.linkedin.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getAction(actionId) {
      return this._makeRequest({
        path: `/v2/actions/${actionId}`,
      });
    },
    async getMessage(messageId) {
      return this._makeRequest({
        path: `/v2/messages/${messageId}`,
      });
    },
    async getConnection(connectionId) {
      return this._makeRequest({
        path: `/v2/connections/${connectionId}`,
      });
    },
    async queueConnectionRequest(profileId) {
      return this._makeRequest({
        method: "post",
        path: "/v2/connectionRequests",
        data: {
          profileId: profileId,
        },
      });
    },
    async queueDirectMessage(profileId, message) {
      return this._makeRequest({
        method: "post",
        path: "/v2/directMessages",
        data: {
          profileId: profileId,
          message: message,
        },
      });
    },
    async queueProfileSave(profileId) {
      return this._makeRequest({
        method: "post",
        path: "/v2/profileSaves",
        data: {
          profileId: profileId,
        },
      });
    },
    async emitEvent(eventName, data) {
      this.$emit(data, {
        summary: `New ${eventName} event occurred`,
        id: data.id,
      });
    },
  },
};
