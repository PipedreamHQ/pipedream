import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agrello",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder",
      async options({ page }) {
        return await this.listFolders({
          params: {
            page,
          },
        });
      },
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document",
      async options({
        folderId, page,
      }) {
        const { content } = await this.listDocuments({
          folderId,
          params: {
            page,
          },
        });
        return content.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.agrello.io/public/v3";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
    async listFolders() {
      const { content } = await this._makeRequest({
        path: "/folders",
      });

      const folders = [];
      for (const parent of content) {
        folders.push({
          label: `${parent.name}`,
          value: parent.id,
        });
        folders.push(...await this.getSubFolders(parent.name, parent.id));
      }

      return folders;

    },
    async getSubFolders(parentName, parentId) {
      const folders = [];
      const { subspaces } = await this._makeRequest({
        path: `/folders/${parentId}/folders`,
      });
      for (const folder of subspaces) {
        const label = `${parentName} - ${folder.name}`;
        folders.push({
          label,
          value: folder.id,
        });
        folders.push(...await this.getSubFolders(label, folder.id));
      }
      return folders;
    },
    listDocuments({
      folderId, ...opts
    }) {
      return this._makeRequest({
        path: `/folders/${folderId}/containers`,
        ...opts,
      });
    },
    getDocument({ documentId }) {
      return this._makeRequest({
        path: `/containers/${documentId}`,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = page++;
        const { content } = await fn({
          params,
          ...opts,
        });
        for (const d of content) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = content.length;

      } while (hasMore);
    },
  },
};
