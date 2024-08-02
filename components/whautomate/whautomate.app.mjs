import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whautomate",
  propDefinitions: {
    appointmentId: {
      type: "string",
      label: "Appointment ID",
      description: "The unique identifier of the appointment",
    },
    appointmentDate: {
      type: "string",
      label: "Appointment Date",
      description: "The date of the appointment",
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The unique identifier of the client",
    },
    notificationPref: {
      type: "string",
      label: "Notification Preference",
      description: "The preferred notification method",
      optional: true,
    },
    clientDetails: {
      type: "object",
      label: "Client Details",
      description: "Details of the client",
    },
    assignedAgentId: {
      type: "string",
      label: "Assigned Agent ID",
      description: "The unique identifier of the assigned agent",
      optional: true,
    },
    preferredCommunicationMethod: {
      type: "string",
      label: "Preferred Communication Method",
      description: "The preferred method of communication",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of tag names",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The unique identifier of the WhatsApp message template",
    },
    templateVariables: {
      type: "object",
      label: "Template Variables",
      description: "Variables to populate dynamic parts of the template",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The WhatsApp phone number of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.whautomate.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitAppointmentCancelled({ appointmentId }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/appointments/cancelled",
        data: {
          appointmentId,
        },
      });
    },
    async emitNewAppointmentScheduled({
      appointmentDate, clientId, notificationPref,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/appointments/scheduled",
        data: {
          appointmentDate,
          clientId,
          notificationPref,
        },
      });
    },
    async emitNewClientCreated({
      clientDetails, assignedAgentId, preferredCommunicationMethod,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/clients/created",
        data: {
          clientDetails,
          assignedAgentId,
          preferredCommunicationMethod,
        },
      });
    },
    async assignTagsToContact({
      contactId, tags,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/tags/add`,
        data: {
          tags,
        },
      });
    },
    async sendWhatsAppMessageTemplate({
      contactId, templateId, templateVariables,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/whatsapp/sendtemplate",
        data: {
          contactId,
          templateId,
          templateVariables,
        },
      });
    },
    async createNewContact({
      name, phoneNumber, email,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          name,
          phoneNumber,
          email,
        },
      });
    },
  },
};
