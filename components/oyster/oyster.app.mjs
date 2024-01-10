import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "oyster",
  propDefinitions: {
    employeeName: {
      type: "string",
      label: "Employee's Name",
      description: "The name of the employee",
    },
    requestDetails: {
      type: "string",
      label: "Request Details",
      description: "The details of the request",
    },
    engagementDetails: {
      type: "string",
      label: "Engagement Details",
      description: "The details of the engagement",
      optional: true,
    },
    engagementStart: {
      type: "string",
      label: "Engagement Start Date",
      description: "The start date of the engagement",
      optional: true,
    },
    engagementEnd: {
      type: "string",
      label: "Engagement End Date",
      description: "The end date of the engagement",
      optional: true,
    },
    approvedStatus: {
      type: "boolean",
      label: "Approved Status",
      description: "The status of the approval",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.oysterhr.com";
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
    async authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async postNewTimeOffRequest({
      employeeName, requestDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/time-off-requests",
        data: {
          employeeName,
          requestDetails,
        },
      });
    },
    async postNewEngagement({
      employeeName,
      engagementDetails,
      engagementStart,
      engagementEnd,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/engagements",
        data: {
          employeeName,
          engagementDetails,
          engagementStart,
          engagementEnd,
        },
      });
    },
    async approveTimeOffRequest({
      employeeName, requestDetails, approvedStatus,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/time-off-requests-id-approve",
        data: {
          employeeName,
          requestDetails,
          approvedStatus,
        },
      });
    },
  },
};
