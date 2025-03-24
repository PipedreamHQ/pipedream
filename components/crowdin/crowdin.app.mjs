import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "crowdin",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({ page }) {
        const { data } = await this.listProjects({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return data.map(({
          data: {
            id: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    directoryId: {
      type: "string",
      label: "Directory ID",
      description: "The ID of the directory. **Note:** Can't be used with `Branch Id` in same request",
      optional: true,
      async options({
        page, projectId,
      }) {
        const { data } = await this.listDirectories({
          projectId,
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return data.map(({
          data: {
            id: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    sourceLanguageId: {
      type: "string",
      label: "Source Language ID",
      description: "The language ID of the source language",
      async options({ page }) {
        const { data } = await this.listSupportedLanguages({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return data.map(({
          data: {
            id: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    storageId: {
      type: "integer",
      label: "Storage ID",
      description: "The ID of the storage",
      async options({ page }) {
        const { data } = await this.listStorages({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return data.map(({
          data: {
            id: value, fileName: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    branchId: {
      type: "string",
      label: "Branch ID",
      description: "Defines branch to which file will be added. **Note:** Can't be used with `Directory Id` in same request",
      optional: true,
      async options({
        page, projectId,
      }) {
        const { data } = await this.listBranches({
          projectId,
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return data.map(({
          data: {
            id: value, name, title,
          },
        }) => ({
          label: `${title} - ${name}`,
          value,
        }));
      },
    },
    attachLabelIds: {
      type: "string[]",
      label: "Attach Label IDs",
      description: "The IDs of the labels to attach",
      optional: true,
      async options({
        page, projectId,
      }) {
        const { data } = await this.listLabels({
          projectId,
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return data.map(({
          data: {
            id: value, title: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    mtId: {
      type: "string",
      label: "Machine Translation ID",
      description: "The ID of the machine translation engine",
      async options({ page }) {
        const { data } = await this.listMTs({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return data.map(({
          data: {
            id: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.crowdin.com/api/v2";
    },
    _headers(headers = {}) {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listDirectories({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/directories`,
        ...opts,
      });
    },
    listSupportedLanguages(opts = {}) {
      return this._makeRequest({
        path: "/languages",
        ...opts,
      });
    },
    listStorages(opts = {}) {
      return this._makeRequest({
        path: "/storages",
        ...opts,
      });
    },
    listBranches({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/branches`,
        ...opts,
      });
    },
    listLabels({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/labels`,
        ...opts,
      });
    },
    listMTs(opts = {}) {
      return this._makeRequest({
        path: "/mts",
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
    createStorage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/storages",
        ...opts,
      });
    },
    uploadFileToProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/files`,
        ...opts,
      });
    },
    performMachineTranslation({
      mtId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/mts/${mtId}/translations`,
        ...opts,
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
      projectId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/projects/${projectId}/webhooks/${webhookId}`,
      });
    },
    async *paginate({
      fn, params = {}, ...opts
    }) {
      let hasMore = false;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page++;
        const { data } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
