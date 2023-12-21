import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nifty_pm",
  version: "0.0.{{ts}}",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The unique identifier for the app.",
    },
    webhookId: {
      type: "string",
      label: "Webhook ID",
      description: "The unique identifier for the webhook.",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The unique identifier for the project.",
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task.",
    },
    taskDescription: {
      type: "string",
      label: "Task Description",
      description: "The description of the task.",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message.",
    },
    teamMemberId: {
      type: "string",
      label: "Team Member ID",
      description: "The unique identifier for the team member.",
    },
    portfolioId: {
      type: "string",
      label: "Portfolio ID",
      description: "The unique identifier for the portfolio.",
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project to create.",
    },
    projectDescription: {
      type: "string",
      label: "Project Description",
      description: "The description of the project.",
    },
    taskAssigneeId: {
      type: "string",
      label: "Assignee ID",
      description: "The ID of the user to assign the task to",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to send webhook notifications to",
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The type of the event to trigger the webhook",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.niftypm.com/api/v1.0";
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
    async createWebhook({
      projectId, webhookUrl, eventType,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          project_id: projectId,
          url: webhookUrl,
          event: eventType,
        },
      });
    },
    async createProject({
      portfolioId, projectName, projectDescription,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        data: {
          portfolio_id: portfolioId,
          name: projectName,
          description: projectDescription,
        },
      });
    },
    async assignTask({
      taskId, taskAssigneeId,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tasks/${taskId}/assignees`,
        data: {
          assignee_id: taskAssigneeId,
        },
      });
    },
    async sendMessage({
      projectId, messageContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/messages`,
        data: {
          content: messageContent,
        },
      });
    },
  },
};
