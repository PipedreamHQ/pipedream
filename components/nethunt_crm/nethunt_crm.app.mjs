import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nethunt_crm",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder",
      description: "The Folder ID.",
      async options() {
        const folders = await this.listFolders();
        return folders.map((folder) => ({
          label: folder.name,
          value: folder.id,
        }));
      },
    },
    recordId: {
      type: "string",
      label: "Record",
      description: "The Record ID. This prop will list records up to 1 month ago.",
      async options({ folderId }) {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const records = await this.listRecentlyCreatedRecordsInFolder({
          folderId,
          params: {
            since: monthAgo,
          },
        });
        return records.reverse().map((record) => ({
          label: record.fields.Name,
          value: record.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://nethunt.com/api/v1";
    },
    _auth() {
      return {
        username: this.$auth.email_address,
        password: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        auth: this._auth(),
      });
    },
    async listFolders(opts = {}) {
      const path = "/zapier/triggers/writable-folder";
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async listRecentlyCreatedRecordsInFolder({
      folderId, ...opts
    }) {
      const path = `/zapier/triggers/new-record/${folderId}`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async listRecentlyUpdatedRecordsInFolder({
      folderId, ...opts
    }) {
      const path = `/zapier/triggers/updated-record/${folderId}`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async listRecentlyCreatedCommentsInFolder({
      folderId, ...opts
    }) {
      const path = `/zapier/triggers/new-comment/${folderId}`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async createComment({
      recordId, ...opts
    }) {
      const path = `/zapier/actions/create-comment/${recordId}`;
      return this._makeRequest({
        ...opts,
        method: "post",
        path,
      });
    },
    async linkGmailThread({
      recordId, ...opts
    }) {
      const path = `/zapier/actions/link-gmail-thread/${recordId}`;
      return this._makeRequest({
        ...opts,
        method: "post",
        path,
      });
    },
    async findRecordById({
      folderId, recordId, ...opts
    }) {
      const path = `/zapier/searches/find-record/${folderId}?recordId=${recordId}`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async findRecords({
      folderId, query, limit, ...opts
    }) {
      let path = `/zapier/searches/find-record/${folderId}?limit=${limit ?? 1}`;
      if (query?.length) {
        path += `&query=${encodeURIComponent(query)}`;
      }
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async createRecord({
      folderId, ...opts
    }) {
      const path = `/zapier/actions/create-record/${folderId}`;
      return this._makeRequest({
        ...opts,
        method: "post",
        path,
      });
    },
    async updateRecord({
      recordId, overwrite = false, ...opts
    }) {
      const path = `/zapier/actions/update-record/${recordId}?overwrite=${overwrite}`;
      return this._makeRequest({
        ...opts,
        method: "post",
        path,
      });
    },
  },
};
