import { axios } from "@pipedream/platform";

export default {
  key: "asana-update-task",
  name: "Update Task",
  description: "Updates a specific and existing task. [See the docs here](https://developers.asana.com/docs/update-a-task)",
  version: "0.3.3",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    workspace: {
      type: "string",
      label: "Workspace",
      description: "Gid of a workspace.",
      optional: true,
      async options() {
        const workspaces = await this.getWorkspaces();
        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace.gid,
        }));
      },
    },
    project: {
      type: "string",
      label: "Project",
      description: "List of projects. This field use the project GID.",
      optional: true,
      async options({ workspace }) {
        const projects = await this.getProjects(workspace);
        return projects.map((tag) => ({
          label: tag.name,
          value: tag.gid,
        }));
      },
    },
    task_gid: {
      type: "string",
      label: "Task GID",
      description: "The ID of the task to update",
      async options({ project }) {
        const tasks = await this.getTasks({
          params: {
            project,
          },
        });
        return tasks.map(({
          name: label, gid: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the task. This is generally a short sentence fragment that fits on a line in the UI for maximum readability. However, it can be longer.",
    },
    assignee: {
      type: "string",
      label: "Assignee",
      description: "Gid of a user.",
      optional: true,
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: user.name,
          value: user.gid,
        }));
      },
    },
    assignee_section: {
      type: "string",
      label: "Assignee Section",
      description: "The assignee section is a subdivision of a project that groups tasks together in the assignee's \"My Tasks\" list.",
      optional: true,
      async options({ project }) {
        const sections = await this.getSections(project);
        return sections.map((section) => {
          return {
            label: section.name,
            value: section.gid,
          };
        });
      },
    },
    completed: {
      label: "Completed",
      description: "True if the task is currently marked complete, false if not.",
      type: "boolean",
      optional: true,
    },
    due_at: {
      label: "Due At",
      description: "The UTC date and time on which this task is due, or null if the task has no due time. This takes an ISO 8601 date string in UTC and should not be used together with due_on.",
      type: "string",
      optional: true,
    },
    due_on: {
      label: "Due On",
      description: "The localized date on which this task is due, or null if the task has no due date. This takes a date with YYYY-MM-DD format and should not be used together with due_at.",
      type: "string",
      optional: true,
    },
    html_notes: {
      label: "HTML Notes",
      description: "The notes of the text with formatting as HTML.",
      type: "string",
      optional: true,
    },
    notes: {
      label: "Notes",
      description: "Free-form textual information associated with the task (i.e. its description).",
      type: "string",
      optional: true,
    },
    start_on: {
      label: "Start On",
      description: "The day on which work begins for the task , or null if the task has no start date. This takes a date with YYYY-MM-DD format.",
      type: "string",
      optional: true,
    },
    custom_fields: {
      label: "Custom Fields",
      description: `An object where each key is a Custom Field gid and each value is an enum gid, string, or number: E.g. {
        "4578152156": "Not Started",
        "5678904321": "On Hold"
      }`,
      type: "string",
      optional: true,
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://app.asana.com/api/1.0";
    },
    _headers() {
      return {
        Accept: "application/json",
        Authorization: `Bearer ${this._accessToken()}`,
      };
    },
    async _makeRequest(path, options = {}, $ = this) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._headers(),
        ...options,
      };
      return axios($, config);
    },
    async getWorkspaces() {
      return (await this._makeRequest("workspaces")).data;
    },
    async getProjects(workspaceId, params = {}, $) {
      return (await this._makeRequest("projects", {
        params: {
          workspace: workspaceId,
          ...params,
        },
      }, $)).data;
    },
    async getTasks(params, $) {
      const response = await this._makeRequest("tasks", params, $);
      return response.data;
    },
    async getUsers(params = {}) {
      const {
        workspace,
        team,
      } = params;
      return (await this._makeRequest("users", {
        params: {
          workspace,
          team,
        },
      })).data;
    },
    async getSections(project, $) {
      const response = await this._makeRequest(`projects/${project}/sections`, {}, $);
      return response.data ?? [];
    },
  },
  async run({ $ }) {
    let customFields;
    if (this.custom_fields) customFields = JSON.parse(this.custom_fields);

    const response = await this._makeRequest(`tasks/${this.task_gid}`, {
      method: "put",
      data: {
        data: {
          name: this.name,
          assignee: this.assignee,
          assignee_section: this.assignee_section,
          completed: this.completed,
          due_at: this.due_at,
          due_on: this.due_on,
          html_notes: this.html_notes,
          notes: this.notes,
          start_on: this.start_on,
          workspace: this.workspace,
          custom_fields: customFields,
        },
      },
    }, $);

    $.export("$summary", "Successfully updated task");

    return response.data;
  },
};
