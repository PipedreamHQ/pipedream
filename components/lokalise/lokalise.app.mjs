import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lokalise",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Identifier of a project",
      async options({ page }) {
        const { projects } = await this.listProjects({
          params: {
            page: page + 1,
          },
        });
        return projects?.map(({
          project_id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language/locale code of the project base language",
      async options({ page }) {
        const { languages } = await this.listLanguages({
          params: {
            page: page + 1,
          },
        });
        return languages?.map(({
          lang_iso: value, lang_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lokalise.com/api2";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    createWebhook({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/webhooks`,
        ...opts,
      });
    },
    deleteWebhook({
      projectId, hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/projects/${projectId}/webhooks/${hookId}`,
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/system/languages",
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
    uploadFile({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/files/upload`,
        ...opts,
      });
    },
    downloadFiles({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/files/download`,
        ...opts,
      });
    },
  },
};
