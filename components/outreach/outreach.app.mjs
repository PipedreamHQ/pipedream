import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "outreach",
  version: "0.0.1",
  propDefinitions: {
    accountName: {
      type: "string",
      label: "Account Name",
      description: "The name of the account.",
    },
    accountIndustry: {
      type: "string",
      label: "Industry",
      description: "The industry the account belongs to.",
    },
    accountLocation: {
      type: "string",
      label: "Location",
      description: "The location of the account.",
    },
    accountDescription: {
      type: "string",
      label: "Description",
      description: "A description of the account.",
      optional: true,
    },
    accountPhoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the account.",
      optional: true,
    },
    prospectName: {
      type: "string",
      label: "Name",
      description: "The name of the prospect.",
    },
    prospectEmail: {
      type: "string",
      label: "Email",
      description: "The email of the prospect.",
    },
    prospectTitle: {
      type: "string",
      label: "Title",
      description: "The title of the prospect.",
      optional: true,
    },
    prospectCompanyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the prospect.",
      optional: true,
    },
    prospectPhoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the prospect.",
      optional: true,
    },
    prospectId: {
      type: "string",
      label: "Prospect ID",
      description: "The ID of the prospect.",
    },
    sequenceId: {
      type: "string",
      label: "Sequence ID",
      description: "The ID of the sequence.",
    },
    sequenceStartDate: {
      type: "string",
      label: "Start Date",
      description: "The start date for the sequence.",
      optional: true,
    },
    sequenceStepsToExclude: {
      type: "string[]",
      label: "Steps to Exclude",
      description: "The steps to exclude from the sequence.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.outreach.io";
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
    async createAccount({
      accountName, accountIndustry, accountLocation, accountDescription, accountPhoneNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v2/accounts",
        data: {
          data: {
            attributes: {
              name: accountName,
              industry: accountIndustry,
              location: accountLocation,
              description: accountDescription,
              phone: accountPhoneNumber,
            },
            type: "account",
          },
        },
      });
    },
    async createProspect({
      prospectName, prospectEmail, prospectTitle, prospectCompanyName, prospectPhoneNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v2/prospects",
        data: {
          data: {
            attributes: {
              name: prospectName,
              email: prospectEmail,
              title: prospectTitle,
              companyName: prospectCompanyName,
              phone: prospectPhoneNumber,
            },
            type: "prospect",
          },
        },
      });
    },
    async addProspectToSequence({
      prospectId, sequenceId, sequenceStartDate, sequenceStepsToExclude,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/v2/prospects/${prospectId}/sequences/${sequenceId}`,
        data: {
          data: {
            attributes: {
              startDate: sequenceStartDate,
              excludeSteps: sequenceStepsToExclude,
            },
            type: "sequenceState",
          },
        },
      });
    },
  },
};
