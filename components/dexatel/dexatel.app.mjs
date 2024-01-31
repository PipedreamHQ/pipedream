import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dexatel",
  propDefinitions: {
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact to create or update.",
    },
    contactNumber: {
      type: "string",
      label: "Contact Number",
      description: "The phone number of the contact to create or update.",
    },
    recipientNumber: {
      type: "string",
      label: "Recipient Number",
      description: "The phone number of the message recipient.",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to send.",
    },
    recipientNumbers: {
      type: "string[]",
      label: "Recipient Numbers",
      description: "An array of phone numbers to send messages in bulk.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dexatel.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "X-Dexatel-Key": `${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async createContact({
      contactName, contactNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/audiences/contacts",
        data: {
          data: {
            number: contactNumber,
            first_name: contactName,
          },
        },
      });
    },
    async sendMessage({
      recipientNumber, messageContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        data: {
          data: {
            to: [
              recipientNumber,
            ],
            text: messageContent,
            channel: "SMS",
          },
        },
      });
    },
    async sendBulkMessages({
      recipientNumbers, messageContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        data: {
          data: {
            to: recipientNumbers,
            text: messageContent,
            channel: "SMS",
          },
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
