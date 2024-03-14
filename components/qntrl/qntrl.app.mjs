import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "qntrl",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The unique identifier for the job.",
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The unique identifier for the organization.",
    },
    jobCreatorId: {
      type: "string",
      label: "Job Creator ID",
      description: "The unique identifier for the job creator.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the job.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the job.",
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "The type of the job.",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the job.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the new user.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the new user.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the new user.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the new user.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the new user account.",
      optional: true,
      secret: true,
    },
    userRole: {
      type: "string",
      label: "User Role",
      description: "The role of the new user.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment to be posted under the job.",
    },
    attachment: {
      type: "string",
      label: "Attachment",
      description: "The attachment to be included with the comment.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://coreapi.qntrl.com/blueprint/api";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createJob(args) {
      return this._makeRequest({
        method: "POST",
        url: "/jobs",
        ...args,
      });
    },
    async addUser(args) {
      return this._makeRequest({
        method: "POST",
        url: "/users",
        ...args,
      });
    },
    async postComment({
      jobId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/jobs/${jobId}/comments`,
        ...args,
      });
    },
  },
};
