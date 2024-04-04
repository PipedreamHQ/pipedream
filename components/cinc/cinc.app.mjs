import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cinc",
  propDefinitions: {
    inquiryIdentifier: {
      type: "string",
      label: "Inquiry Identifier",
      description: "The identifier for the inquiry request",
    },
    leadDetails: {
      type: "object",
      label: "Lead Details",
      description: "Details of the new lead",
    },
    leadSource: {
      type: "string",
      label: "Lead Source",
      description: "The source of the lead",
      optional: true,
    },
    timeOfAddition: {
      type: "string",
      label: "Time of Addition",
      description: "The time the lead was added",
      optional: true,
    },
    leadIdentifier: {
      type: "string",
      label: "Lead Identifier",
      description: "The identifier for the lead",
    },
    updatedDetails: {
      type: "object",
      label: "Updated Details",
      description: "The details to be updated for the lead",
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields for the new lead",
      optional: true,
    },
    leadSearchData: {
      type: "object",
      label: "Lead's Search Data",
      description: "Search data for creating a saved search",
    },
    fieldsToUpdate: {
      type: "object",
      label: "Fields to Update",
      description: "Fields to update for an existing lead",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.cinc.com";
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
    async emitInquiryEvent(inquiryId) {
      this.$emit({
        inquiryId,
      }, {
        summary: `New inquiry requested: ${inquiryId}`,
      });
    },
    async emitNewLeadEvent(leadDetails) {
      this.$emit({
        leadDetails,
      }, {
        summary: "New lead added",
      });
    },
    async emitLeadUpdateEvent(leadIdentifier, updatedDetails) {
      this.$emit({
        leadIdentifier,
        updatedDetails,
      }, {
        summary: "Lead's information updated",
      });
    },
    async createLead(leadDetails, customFields) {
      return this._makeRequest({
        method: "POST",
        path: "/leads",
        data: {
          ...leadDetails,
          custom_fields: customFields,
        },
      });
    },
    async createSavedSearch(leadSearchData) {
      return this._makeRequest({
        method: "POST",
        path: "/saved_searches",
        data: leadSearchData,
      });
    },
    async updateLead(leadId, fieldsToUpdate) {
      return this._makeRequest({
        method: "PATCH",
        path: `/leads/${leadId}`,
        data: fieldsToUpdate,
      });
    },
  },
};
