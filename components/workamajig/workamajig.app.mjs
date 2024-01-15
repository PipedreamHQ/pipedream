import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "workamajig",
  propDefinitions: {
    leadType: {
      type: "string",
      label: "Lead Type",
      description: "Type of the lead if lead types are in use in Workamajig",
      optional: true,
    },
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "ID of the specific opportunity to monitor",
    },
    activityDetails: {
      type: "object",
      label: "Activity Details",
      description: "Details and parameters of the activity to be created",
    },
    companyDetails: {
      type: "object",
      label: "Company Details",
      description: "Details and information of the company to be created",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "ID of the existing contact to be updated",
    },
    newContactDetails: {
      type: "object",
      label: "New Contact Details",
      description: "New details of the contact to be updated",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app6.workamajig.com/platinum";
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
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async createActivity({ activityDetails }) {
      return this._makeRequest({
        method: "POST",
        path: "/activity",
        data: activityDetails,
      });
    },
    async createCompany({ companyDetails }) {
      return this._makeRequest({
        method: "POST",
        path: "/company",
        data: companyDetails,
      });
    },
    async updateContact({
      contactId, newContactDetails,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contact/${contactId}`,
        data: newContactDetails,
      });
    },
  },
};
