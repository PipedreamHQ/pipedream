import { axios } from "@pipedream/platform";

const DEFAULT_MAX = 100;
const PER_PAGE = 100;

export default {
  type: "app",
  app: "postcards",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Numeric `id` (e.g. `305876`) or `obfuscated_id` (e.g. `32b3f40e`).",
      async options({
        page, folderId,
      }) {
        const { data } = await this.listProjects({
          params: {
            page: page + 1,
            per_page: PER_PAGE,
            ...(folderId
              ? {
                folder_id: folderId,
              }
              : {}),
          },
        });
        return data.map((project) => ({
          label: project.name || `${project.id}`,
          value: `${project.obfuscated_id ?? project.id}`,
        }));
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Numeric `id` (e.g. `512`) or `obfuscated_id` (e.g. `a1b2c3d4`) of a folder. Get IDs from **List Folders**.",
      optional: true,
      async options({ page }) {
        const { data } = await this.listFolders({
          params: {
            page: page + 1,
            per_page: PER_PAGE,
          },
        });
        return data.map((folder) => ({
          label: folder.name || `${folder.id}`,
          value: `${folder.obfuscated_id ?? folder.id}`,
        }));
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of items to return.",
      optional: true,
      min: 1,
      default: DEFAULT_MAX,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-postcards.designmodo.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    getProject({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${id}`,
        ...args,
      });
    },
    exportProject({
      id, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/projects/${id}/export`,
        ...args,
      });
    },
    listFolders(args = {}) {
      return this._makeRequest({
        path: "/folders",
        ...args,
      });
    },
    getFolder({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/folders/${id}`,
        ...args,
      });
    },
    getUsage(args = {}) {
      return this._makeRequest({
        path: "/usage",
        ...args,
      });
    },
    async *_paginate({
      resourceFn, params = {}, max = DEFAULT_MAX,
    }) {
      let page = 1;
      let count = 0;
      while (true) {
        const {
          data, meta,
        } = await resourceFn({
          params: {
            ...params,
            page,
            per_page: PER_PAGE,
          },
        });
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          if (++count >= max) {
            return;
          }
        }
        if (!meta?.total_pages || page >= meta.total_pages) {
          return;
        }
        page += 1;
      }
    },
    async _collect(iterator) {
      const results = [];
      for await (const item of iterator) {
        results.push(item);
      }
      return results;
    },
    getProjects({
      $ = this, params, max,
    } = {}) {
      return this._collect(this._paginate({
        resourceFn: (opts) => this.listProjects({
          $,
          ...opts,
        }),
        params,
        max,
      }));
    },
    getFolders({
      $ = this, max,
    } = {}) {
      return this._collect(this._paginate({
        resourceFn: (opts) => this.listFolders({
          $,
          ...opts,
        }),
        max,
      }));
    },
  },
};
