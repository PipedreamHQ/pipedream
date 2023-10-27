import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "productlane",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project. [See the documentation](https://productlane.com/docs/api-reference/portal/list-projects) for more information",
      async options() {
        const projects = await this.listProjects();
        return projects.map((p) => ({
          label: p.name,
          value: p.id,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    notify: {
      type: "boolean",
      label: "Notify",
      description: "Whether to notify",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://productlane.com/api/v1";
    },
    _workspaceId() {
      return this.$auth.workspace_id;
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createContact(opts) {
      return this._makeRequest({
        ...opts,
        path: "/contacts",
        method: "POST",
      });
    },
    async upvoteProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/projects/${projectId}/upvotes`,
        method: "POST",
      });
    },
    async createFeedback(opts) {
      return this._makeRequest({
        ...opts,
        path: "/feedback",
        method: "POST",
      });
    },
    async listProjects() {
      const { projects } = await this._makeRequest({
        path: `/projects/${this._workspaceId()}`,
      });
      return projects;
    },
  },
};
