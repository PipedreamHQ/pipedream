import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fogbugz",
  propDefinitions: {
    filterId: {
      type: "string",
      label: "Filter ID",
      description: "The ID of the filter to monitor for new cases.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user (ixPerson) to edit.",
    },
    caseDetails: {
      type: "object",
      label: "Case Details",
      description: "The details of the case to create or edit.",
      optional: true,
    },
    userDetails: {
      type: "object",
      label: "User Details",
      description: "The details of the user to create or edit.",
      optional: true,
    },
    caseNumber: {
      type: "string",
      label: "Case Number",
      description: "The case number to retrieve details for.",
      optional: true,
    },
    sEmail: {
      type: "string",
      label: "Email",
      description: "The email of the user to create.",
      optional: true,
    },
    sFullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the user to create.",
      optional: true,
    },
    sTitle: {
      type: "string",
      label: "Case Title",
      description: "The title of the case to create.",
      optional: true,
    },
    ixPerson: {
      type: "string",
      label: "User ID as ixPerson",
      description: "The ID of the user (ixPerson) to edit.",
      optional: true,
    },
    q: {
      type: "string",
      label: "Query",
      description: "The search query for case details.",
      optional: true,
    },
    cols: {
      type: "string[]",
      label: "Columns",
      description: "The columns to include in the case details search results.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.manuscript.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createCase({ caseDetails }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/cases/new",
        data: caseDetails,
      });
    },
    async createUser({
      sEmail, sFullName, ...otherOpts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/users/new",
        data: {
          sEmail,
          sFullName,
          ...otherOpts,
        },
      });
    },
    async editUser({
      ixPerson, userDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/users/${ixPerson}/edit`,
        data: userDetails,
      });
    },
    async getCaseDetails({ caseNumber }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/search",
        data: {
          q: caseNumber,
          cols: [
            "events",
          ],
        },
      });
    },
    async listProjects() {
      return this._makeRequest({
        method: "GET",
        path: "/api/projects/list",
      });
    },
  },
};
