import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "satuit",
  propDefinitions: {
    activityType: {
      type: "string",
      label: "Activity Type",
      description: "The type of activity",
      optional: true,
    },
    activityDate: {
      type: "string",
      label: "Activity Date",
      description: "The date of the activity",
      optional: true,
    },
    associatedUser: {
      type: "string",
      label: "Associated User",
      description: "The user associated with the activity",
      optional: true,
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "The details of the contact",
    },
    contactPreferences: {
      type: "object",
      label: "Contact Preferences",
      description: "The preferences related to the contact",
      optional: true,
    },
    opportunityTitle: {
      type: "string",
      label: "Opportunity Title",
      description: "The title of the opportunity",
    },
    opportunityDescription: {
      type: "string",
      label: "Opportunity Description",
      description: "The description of the opportunity",
    },
    opportunityValue: {
      type: "number",
      label: "Opportunity Value",
      description: "The value of the opportunity",
    },
    associatedBusinesses: {
      type: "string[]",
      label: "Associated Businesses",
      description: "The businesses associated with the opportunity",
      optional: true,
    },
    associatedContacts: {
      type: "string[]",
      label: "Associated Contacts",
      description: "The contacts associated with the opportunity",
      optional: true,
    },
    businessName: {
      type: "string",
      label: "Business Name",
      description: "The name of the business",
    },
    industryType: {
      type: "string",
      label: "Industry Type",
      description: "The industry type of the business",
    },
    businessDescription: {
      type: "string",
      label: "Business Description",
      description: "The description of the business",
      optional: true,
    },
    businessAddress: {
      type: "string",
      label: "Business Address",
      description: "The address of the business",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the contact",
    },
    dealName: {
      type: "string",
      label: "Deal Name",
      description: "The name of the deal flow",
    },
    involvedParties: {
      type: "string[]",
      label: "Involved Parties",
      description: "The parties involved in the deal flow",
    },
    dealValue: {
      type: "number",
      label: "Deal Value",
      description: "The value of the deal flow",
      optional: true,
    },
    expectedClosingDate: {
      type: "string",
      label: "Expected Closing Date",
      description: "The expected closing date of the deal flow",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.satuitcrm.com";
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
    async createActivity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/activities",
        ...opts,
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    async createOpportunity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/opportunities",
        ...opts,
      });
    },
    async createBusiness(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/businesses",
        ...opts,
      });
    },
    async searchContactByEmail(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/contacts/search?email=${opts.emailAddress}`,
      });
    },
    async createDealFlow(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/dealflows",
        ...opts,
      });
    },
  },
  version: "0.0.{{ts}}",
};
