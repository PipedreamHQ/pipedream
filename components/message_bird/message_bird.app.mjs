import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "message_bird",
  propDefinitions: {
    originator: {
      type: "string",
      label: "Originator",
      description: "The sender of the message. This can be a telephone number (including country code) or an alphanumeric string. In case of an alphanumeric string, the maximum length is 11 characters.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the message",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "An array of recipients msisdns (phone numbers)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://rest.messagebird.com";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `AccessKey ${this.$auth.access_key}`,
        },
        ...opts,
      });
    },
    listSMSMessages(opts = {}) {
      return this._makeRequest({
        path: "/messages",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    sendSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    sendVoiceMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/voicemessages",
        ...opts,
      });
    },
  },
};
