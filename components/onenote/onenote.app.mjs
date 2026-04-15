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
    pageId: {
      label: "Page ID",
      description: "The page ID",
      type: "string",
      async options() {
        const { value: pages } = await this.getPages();
        return pages.map((page) => ({
          label: page.title,
          value: page.id,
        }));
      },
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search for notebooks. [See the documentation](https://learn.microsoft.com/en-us/graph/search-query-parameter?tabs=http)",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter for notebooks. [See the documentation](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter)",
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Expand the response",
      optional: true,
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
    async getPages(args = {}) {
      return this._makeRequest({
        path: "/me/onenote/pages",
        ...args,
      });
    },
    async getPage({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `/me/onenote/pages/${pageId}`,
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
