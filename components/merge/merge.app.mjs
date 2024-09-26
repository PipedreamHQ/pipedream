import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "merge",
  propDefinitions: {
    user: {
      type: "string",
      label: "ID",
      description: "ID of the user",
      async options() {
        const { results } = await this.getUsers();

        return results.map(({
          id, first_name, last_name,
        }) => ({
          value: id,
          label: first_name + " " + last_name,
        }));
      },
    },
    activityType: {
      type: "string",
      label: "Type",
      description: "Type of the activity",
      options: constants.ACTIVITY_TYPES,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the activity",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The activity's body",
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Visibility of the activity",
      options: constants.VISIBILITIES,
    },
    candidate: {
      type: "string",
      label: "Candidate",
      description: "The activity's candidate",
      async options() {
        const { results } = await this.getCandidates();

        return results.map(({
          id, first_name, last_name,
        }) => ({
          value: id,
          label: first_name + " " + last_name,
        }));
      },
    },
    remoteUserId: {
      type: "string",
      label: "Remote User ID",
      description: "ID of the user that is sending the request",
      async options() {
        const { results } = await this.getUsers();

        return results.map(({
          id, first_name, last_name,
        }) => ({
          value: id,
          label: first_name + " " + last_name,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The candidate's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The candidate's last name",
    },
    canEmail: {
      type: "boolean",
      label: "Can Email",
      description: "Whether or not the candidate can be emailed",
    },
    emailAddress: {
      type: "string",
      label: "Email Addresses",
      description: "The candidate's email address",
    },
    emailType: {
      type: "string",
      label: "Email Type",
      description: "The candidate's email address",
      options: constants.EMAIL_TYPES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.merge.dev/api/ats/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "X-Account-Token": this.$auth.account_token,
        },
      });
    },
    async createActivity(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/activities",
        ...args,
      });
    },
    async createCandidate(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/candidates",
        ...args,
      });
    },
    async updateCandidate({
      id, ...args
    }) {
      return this._makeRequest({
        method: "patch",
        path: `/candidates/${id}`,
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getCandidates(args = {}) {
      return this._makeRequest({
        path: "/candidates",
        ...args,
      });
    },
  },
};
