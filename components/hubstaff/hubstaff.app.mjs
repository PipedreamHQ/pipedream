import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hubstaff",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options() {
        const organizations = await this.listOrganizations();
        return organizations.map((org) => ({
          label: org.name,
          value: org.id,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({ organizationId }) {
        const projects = await this.listProjects({
          organizationId,
        });
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({
        organizationId, projectId,
      }) {
        const tasks = await this.listTasks({
          organizationId,
          projectId,
        });
        return tasks.map((task) => ({
          label: task.summary,
          value: task.id,
        }));
      },
    },
    userIds: {
      type: "string[]",
      label: "User IDs",
      description: "List of user IDs",
      async options({ organizationId }) {
        const users = await this.listUsers({
          organizationId,
        });
        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task",
      options: [
        "active",
        "completed",
        "deleted",
        "archived",
        "archived_native_active",
        "archived_native_completed",
        "archived_native_deleted",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hubstaff.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
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
    async listOrganizations() {
      return this._makeRequest({
        path: "/organizations",
      });
    },
    async listProjects({ organizationId }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/projects`,
      });
    },
    async listTasks({
      organizationId, projectId,
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/projects/${projectId}/tasks`,
      });
    },
    async listUsers({ organizationId }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/users`,
      });
    },
    async createTask({
      organizationId, projectId, summary, dueDate, assigneeIds,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/organizations/${organizationId}/projects/${projectId}/tasks`,
        data: {
          summary,
          due_date: dueDate,
          assignee_ids: assigneeIds,
        },
      });
    },
    async updateTask({
      taskId, organizationId, projectId, summary, status, assigneeIds,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tasks/${taskId}`,
        data: {
          organization_id: organizationId,
          project_id: projectId,
          summary,
          status,
          assignee_ids: assigneeIds,
        },
      });
    },
    async listAllTasks({
      organizationId, projectId, status, userIds,
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/tasks`,
        params: {
          project_id: projectId,
          status,
          user_ids: userIds,
        },
      });
    },
    async emitNewClientEvent() {
      // Logic to emit new client event
    },
    async emitNewScheduleEvent({ organizationId }) {
      // Logic to emit new schedule event
    },
    async emitUpdatedScheduleEvent({ organizationId }) {
      // Logic to emit updated schedule event
    },
  },
};
