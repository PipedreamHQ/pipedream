import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "content_snare",
  propDefinitions: {
    requestName: {
      type: "string",
      label: "Request Name",
      description: "The name of the request to initiate on Content Snare.",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the client's company.",
    },
    clientEmail: {
      type: "string",
      label: "Client Email",
      description: "The email address of the client.",
    },
    clientFullName: {
      type: "string",
      label: "Client Full Name",
      description: "The full name of the client.",
    },
    clientPhone: {
      type: "string",
      label: "Client Phone",
      description: "The phone number of the client.",
      optional: true,
    },
    additionalProps: {
      type: "object",
      label: "Additional Properties",
      description: "Additional properties for creating a request or client.",
      optional: true,
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The ID of the request",
      async options() {
        const { requests } = await this.listRequests();
        return requests.map((request) => ({
          label: request.name,
          value: request.id,
        }));
      },
    },
    fieldId: {
      type: "string",
      label: "Field ID",
      description: "The ID of the field",
      async options({ requestId }) {
        const { fields } = await this.listFields(requestId);
        return fields.map((field) => ({
          label: field.label,
          value: field.id,
        }));
      },
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      async options() {
        const { clients } = await this.listClients();
        return clients.map((client) => ({
          label: client.full_name,
          value: client.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.contentsnare.com/partner_api/v1";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listRequests() {
      return this._makeRequest({
        path: `/requests`,
      });
    },
    async listFields(requestId) {
      return this._makeRequest({
        path: `/requests/${requestId}/fields`,
      });
    },
    async listClients() {
      return this._makeRequest({
        path: `/clients`,
      });
    },
    async initiateRequest({ requestName, ...additionalProps }) {
      return this._makeRequest({
        method: "POST",
        path: "/requests",
        data: {
          name: requestName,
          ...additionalProps,
        },
      });
    },
    async generateClient({ companyName, clientEmail, clientFullName, clientPhone, ...additionalProps }) {
      return this._makeRequest({
        method: "POST",
        path: "/clients",
        data: {
          company_name: companyName,
          email: clientEmail,
          full_name: clientFullName,
          phone: clientPhone,
          ...additionalProps,
        },
      });
    },
    async updateClient({ clientId, ...opts }) {
      return this._makeRequest({
        method: "PUT",
        path: `/clients/${clientId}`,
        data: {
          ...opts,
        },
      });
    },
    async emitEvent(eventName, eventData) {
      this.$emit({
        name: eventName,
        data: eventData,
      });
    },
  },
  version: `0.0.${new Date().getTime()}`,
};