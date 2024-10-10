import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wati",
  propDefinitions: {
    whatsappNumber: {
      type: "string",
      label: "WhatsApp Number",
      description: "Your WhatsApp number with country code.",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "Content of the message.",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "Name of the contact.",
      optional: true,
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Contact details, including name and WhatsApp number.",
      properties: {
        name: {
          type: "string",
          label: "Name",
        },
        number: {
          type: "string",
          label: "Number",
        },
      },
    },
    templateDetails: {
      type: "object",
      label: "Template Details",
      description: "Details of the pre-approved template, including name and placeholders.",
      properties: {
        templateName: {
          type: "string",
          label: "Template Name",
        },
        placeholders: {
          type: "string[]",
          label: "Placeholders",
          description: "Template placeholders as an array of objects.",
        },
      },
    },
    attributeDetails: {
      type: "object",
      label: "Attribute Details",
      description: "Details of attributes to update.",
      properties: {
        attributeName: {
          type: "string",
          label: "Attribute Name",
        },
        attributeValue: {
          type: "string",
          label: "Attribute Value",
        },
      },
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "The timestamp of the message.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://your_wati_api_endpoint/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitContactCreatedEvent({
      whatsappNumber, contactName, messageContent,
    }) {
      // Logic to emit event using given parameters
    },
    async emitIncomingMessageEvent({
      whatsappNumber, messageContent, timestamp,
    }) {
      // Logic to emit event using given parameters
    },
    async addContact(contactDetails) {
      const {
        number, name,
      } = contactDetails;
      return this._makeRequest({
        method: "POST",
        path: `/addContact/${number}`,
        data: {
          name,
        },
      });
    },
    async sendTemplateMessage({
      contactDetails, templateDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/sendTemplateMessage",
        params: {
          whatsappNumber: contactDetails.number,
        },
        data: templateDetails,
      });
    },
    async updateContactAttributes({
      contactDetails, attributeDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/updateContactAttributes/${contactDetails.number}`,
        data: {
          customParams: [
            {
              name: attributeDetails.attributeName,
              value: attributeDetails.attributeValue,
            },
          ],
        },
      });
    },
  },
};
