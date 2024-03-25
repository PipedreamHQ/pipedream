import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "leiga",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The project ID in which you wish to monitor for new issues.",
    },
    issueId: {
      type: "string",
      label: "Issue ID",
      description: "The specific issue ID you want to track for updates or deletions.",
    },
    issueTitle: {
      type: "string",
      label: "Issue Title",
      description: "The title of the issue.",
    },
    issueDescription: {
      type: "string",
      label: "Issue Description",
      description: "A description of the issue.",
      optional: true,
    },
    assignedUserId: {
      type: "string",
      label: "Assigned User ID",
      description: "The ID of the user to whom the issue is assigned.",
      optional: true,
    },
    priorityLevel: {
      type: "string",
      label: "Priority Level",
      description: "The priority level of the issue.",
      options: [
        {
          label: "Low",
          value: "low",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "High",
          value: "high",
        },
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.leiga.com/openapi/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createIssue({
      projectId, issueTitle, issueDescription, assignedUserId, priorityLevel,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/issues",
        data: {
          project_id: projectId,
          title: issueTitle,
          description: issueDescription,
          assigned_user_id: assignedUserId,
          priority: priorityLevel,
        },
      });
    },
    async getIssue({ issueId }) {
      return this._makeRequest({
        method: "GET",
        path: `/issues/${issueId}`,
      });
    },
    async deleteIssue({ issueId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/issues/${issueId}`,
      });
    },
  },
  version: "0.0.1",
};
