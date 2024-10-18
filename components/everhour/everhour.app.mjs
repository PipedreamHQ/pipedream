import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "everhour",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({ page }) {
        const projects = await this.listProjects({
          params: {
            limit: LIMIT,
            page: page + 1,
          },
        });

        return projects.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    sectionId: {
      type: "string",
      label: "Section ID",
      description: "The section id of the task",
      async options({ projectId }) {
        const sections = await this.listSections({
          projectId,
        });

        return sections.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tag IDs",
      description: "The tag ids of the task",
      async options() {
        const tags = await this.listTags();

        return tags.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    labels: {
      type: "string[]",
      label: "Tags",
      description: "An array of tags associated with the task",
      async options({ projectId }) {
        const sections = await this.listSections({
          projectId,
        });

        return sections.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({ projectId }) {
        const tasks = await this.getProjectTasks({
          projectId,
        });
        return tasks.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.everhour.com";
    },
    _headers() {
      return {
        "X-Api-Key": `${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listSections({
      projectId, opts,
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/sections`,
        ...opts,
      });
    },
    listTags() {
      return this._makeRequest({
        path: "/tags",
      });
    },
    getProjectTasks({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks`,
        ...opts,
      });
    },
    createTask({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/tasks`,
        ...opts,
      });
    },
    startTimer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/timers",
        ...opts,
      });
    },
    stopTimer(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/timers/current",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${webhookId}`,
      });
    },
  },
};
