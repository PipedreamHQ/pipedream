import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ottertext",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The unique identifier for the form.",
    },
    formType: {
      type: "string",
      label: "Form Type",
      description: "The type of form, e.g., opt-in page or chat.",
    },
    customerIdOrNumber: {
      type: "string",
      label: "Customer ID or Number",
      description: "The customer's ID or phone number.",
      optional: true,
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The type of message, e.g., opt-in, opt-out.",
      optional: true,
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the customer, used as a unique identifier.",
    },
    time: {
      type: "string",
      label: "Time",
      description: "The scheduled time for the message.",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer to whom the message will be sent.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ottertext.com";
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
    async emitFormSubmissionEvent({
      formId, formType,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        data: {
          formId,
          formType,
        },
      });
    },
    async emitMessageReceivedEvent({
      customerIdOrNumber, messageType, messageContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        data: {
          customerIdOrNumber,
          messageType,
          messageContent,
        },
      });
    },
    async addOrUpdateContact({ phoneNumber }) {
      return this._makeRequest({
        method: "POST",
        path: "/AddCustomer",
        data: {
          phoneNumber,
        },
      });
    },
    async scheduleMessage({
      time, customerId, messageContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/ScheduleMessage",
        data: {
          time,
          customerId,
          messageContent,
        },
      });
    },
    async sendMessage({
      customerId, messageContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/SendMessage",
        data: {
          customerId,
          messageContent,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
