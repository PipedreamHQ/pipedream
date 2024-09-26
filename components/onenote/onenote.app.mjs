import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "onenote",
  propDefinitions: {
    notebookId: {
      label: "Notebook ID",
      description: "The notebook ID",
      type: "string",
      async options() {
        const { value: notebooks } = await this.getNotebooks();

        return notebooks.map((notebook) => ({
          label: notebook.displayName,
          value: notebook.id,
        }));
      },
    },
    sectionId: {
      label: "Section ID",
      description: "The section ID",
      type: "string",
      async options() {
        const { value: sections } = await this.getSections();

        return sections.map((section) => ({
          label: section.displayName,
          value: section.id,
        }));
      },
    },
  },
  methods: {
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          Authorization: `Bearer ${this._oauthAccessToken()}`,
        },
      });
    },
    async getNotebooks(args = {}) {
      return this._makeRequest({
        path: "/me/onenote/notebooks",
        ...args,
      });
    },
    async createNotebook(args = {}) {
      return this._makeRequest({
        path: "/me/onenote/notebooks",
        method: "post",
        ...args,
      });
    },
    async createSection({
      notebookId, ...args
    }) {
      return this._makeRequest({
        path: `/me/onenote/notebooks/${notebookId}/sections`,
        method: "post",
        ...args,
      });
    },
    async getSections(args = {}) {
      return this._makeRequest({
        path: "/me/onenote/sections",
        ...args,
      });
    },
    async createPage({
      sectionId, ...args
    }) {
      return this._makeRequest({
        path: `/me/onenote/sections/${sectionId}/pages`,
        method: "post",
        ...args,
      });
    },
  },
};
