import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "echtpost_postcards",
  propDefinitions: {
    design: {
      type: "string",
      label: "Design Template ID",
      description: "The ID of the template used for the postcard design.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to be included in the postcard.",
    },
    recipient: {
      type: "object",
      label: "Recipient Contact Information",
      description: "The contact information of the postcard recipient.",
    },
    scheduledDate: {
      type: "string",
      label: "Scheduled Date",
      description: "The date when the postcard should be delivered.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Contact Name",
      description: "The name of the new contact.",
    },
    address: {
      type: "string",
      label: "Contact Address",
      description: "The address of the new contact.",
    },
    email: {
      type: "string",
      label: "Contact Email",
      description: "The email of the new contact.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Contact Phone Number",
      description: "The phone number of the new contact.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.echtpost.de/v1";
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async sendPostcard({
      design, message, recipient, scheduledDate,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/cards",
        data: {
          card: {
            template_id: design,
            deliver_at: scheduledDate,
            contacts_attributes: recipient,
            message: message,
          },
        },
      });
    },
    async createContact({
      name, address, email, phoneNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          name: name,
          address: address,
          email: email,
          phone_number: phoneNumber,
        },
      });
    },
  },
};
