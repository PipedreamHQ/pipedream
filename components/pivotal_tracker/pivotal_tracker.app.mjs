import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pivotal_tracker",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The project identifier",
      async options() {
        const projects = await this.listProjects();
        return projects?.map((project) => ({
          label: project.name,
          value: project.id,
        })) || [];
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new project",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the project's content",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.pivotaltracker.com/services/v5";
    },
    _headers() {
      return {
        "X-TrackerToken": this.$auth.api_token,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    createWebhook(projectId, args = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/webhooks`,
        ...args,
      });
    },
    deleteWebhook(projectId, webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/projects/${projectId}/webhooks/${webhookId}`,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    createProject(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...args,
      });
    },
    createStory(projectId, args = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/stories`,
        ...args,
      });
    },
  },
};
