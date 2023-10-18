import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "redmine",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The ID of the project",
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user",
    },
    issueId: {
      type: "integer",
      label: "Issue ID",
      description: "The ID of the issue",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the issue",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the issue",
    },
    statusId: {
      type: "integer",
      label: "Status ID",
      description: "The ID of the status",
    },
    priorityId: {
      type: "integer",
      label: "Priority ID",
      description: "The ID of the priority",
    },
    trackerId: {
      type: "integer",
      label: "Tracker ID",
      description: "The ID of the tracker",
    },
  },
  methods: {
    _baseUrl() {
      return "https://redmine.org";
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
          "X-Redmine-API-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async createIssue(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/issues.json",
      });
    },
    async updateProject(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "PUT",
        path: `/projects/${opts.projectId}.json`,
      });
    },
    async deleteUser(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "DELETE",
        path: `/users/${opts.userId}.json`,
      });
    },
    async getIssueCreated(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: `/issues/${opts.issueId}.json`,
      });
    },
    async getProjectUpdated(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: `/projects/${opts.projectId}.json`,
      });
    },
  },
};
