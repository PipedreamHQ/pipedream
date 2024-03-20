import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clicksend",
  propDefinitions: {
    contact: {
      type: "object",
      label: "Contact",
      description: "The contact to be created, primarily composed of name, phone, and email",
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Additional detailed contact information",
      optional: true,
    },
    destinationNumber: {
      type: "string",
      label: "Destination Number",
      description: "The number to which the SMS will be sent",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the SMS message",
    },
    senderId: {
      type: "string",
      label: "Sender ID",
      description: "The ID of the sender",
      optional: true,
    },
    sendingSpeed: {
      type: "string",
      label: "Sending Speed",
      description: "The speed at which the SMS will be sent",
      optional: true,
    },
    pdfDocument: {
      type: "string",
      label: "PDF Document",
      description: "The PDF document to be printed and delivered via post",
    },
    recipientAddress: {
      type: "string",
      label: "Recipient Address",
      description: "The address to which the physical postcard will be sent",
    },
    personalisedMessageContent: {
      type: "string",
      label: "Personalised Message Content",
      description: "The personalised message content for the physical postcard",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://rest.clicksend.com/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          contact: opts.contact,
          custom_fields: opts.customFields,
        },
      });
    },
    async sendSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms/send",
        data: {
          to: opts.destinationNumber,
          body: opts.messageContent,
          from: opts.senderId,
          speed: opts.sendingSpeed,
        },
      });
    },
    async sendPostcard(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/post/postcards",
        data: {
          document: opts.pdfDocument,
          address: opts.recipientAddress,
          message: opts.personalisedMessageContent,
        },
      });
    },
    async emitSMSReceivedEvent() {
      return this._makeRequest({
        path: "/sms/incoming",
      });
    },
    async emitVoiceMessageEvent() {
      return this._makeRequest({
        path: "/voice/messages",
      });
    },
  },
};
