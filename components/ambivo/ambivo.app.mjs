import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ambivo",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact whose status updates you want to monitor",
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Details of the contact to be created or updated",
    },
    leadDetails: {
      type: "object",
      label: "Lead Details",
      description: "Details of the lead to be created or updated",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://fapi.ambivo.com";
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
    async getNewContact() {
      return this._makeRequest({
        path: "/crm/contacts/created",
      });
    },
    async getContactStatusUpdate(contactId) {
      return this._makeRequest({
        path: `/crm/contacts/status_updated/${contactId}`,
      });
    },
    async getNewLead() {
      return this._makeRequest({
        path: "/crm/leads/created",
      });
    },
    async createOrUpdateContact(contactDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/crm/contacts",
        data: contactDetails,
      });
    },
    async createOrUpdateLead(leadDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/crm/leads",
        data: leadDetails,
      });
    },
  },
};
