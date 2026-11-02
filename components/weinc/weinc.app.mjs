import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "weinc",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a project",
      async options({ prevContext }) {
        const limit = 50;
        const offset = prevContext.offset ?? 0;
        const { projects } = await this.listProjects({
          params: {
            limit,
            offset,
          },
        });
        return {
          options: (projects ?? []).map(({
            id, name,
          }) => ({
            value: id,
            label: name,
          })),
          context: {
            offset: offset + limit,
          },
        };
      },
    },
    clientEmail: {
      type: "string",
      label: "Client Email",
      description: "The email address of the client the project belongs to",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Clone files from an org template",
      optional: true,
      async options() {
        const { templates } = await this.listTemplates();
        return (templates ?? []).map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://my.we.inc/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    getProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
  },
};
