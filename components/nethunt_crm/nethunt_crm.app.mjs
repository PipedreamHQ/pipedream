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
  },
};
