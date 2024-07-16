import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "peach",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact to send the message to",
    },
    templateName: {
      type: "string",
      label: "Template Name",
      description: "WhatsApp approved utility template name",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact",
      optional: true,
    },
    arguments: {
      type: "object",
      label: "Arguments",
      description: "Arguments for the template",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.trypeach.io/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async sendTransactionalMessage(opts = {}) {
      const {
        phoneNumber,
        templateName,
        contactName,
        contactEmail,
        arguments: args,
        ...otherOpts
      } = opts;

      const data = {
        template_name: templateName,
        to: {
          name: contactName,
          email: contactEmail,
          phone_number: phoneNumber,
        },
        arguments: args,
      };

      return this._makeRequest({
        method: "POST",
        path: "/transactional_messages",
        data,
        ...otherOpts,
      });
    },
    async emitNewAppResponseCreated() {
      // Logic to emit new event when a new app response is created on Peach
      // This is a placeholder function. Actual implementation would depend on the specific event system and API endpoints provided by Peach.
      return this._makeRequest({
        method: "GET",
        path: "/new_event_endpoint", // Replace with actual endpoint
      });
    },
  },
};
