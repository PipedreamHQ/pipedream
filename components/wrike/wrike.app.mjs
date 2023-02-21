import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wrike",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder",
      async options() {
        const { data: folders } = await this.listFolders();
        return folders.map((folder) => ({
          label: folder.title,
          value: folder.id,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact of a user in the current account",
      async options() {
        const { data: contacts } = await this.listContacts();
        return contacts.map((contact) => ({
          label: `${contact.firstName} ${contact.lastName}`,
          value: contact.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.wrike.com/api/v4";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    async listFolders(opts = {}) {
      return this._makeRequest({
        path: "/folders",
        ...opts,
      });
    },
    async listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    async createTask({
      folderId, ...opts
    }) {
      return this._makeRequest({
        path: `/folders/${folderId}/tasks`,
        method: "post",
        ...opts,
      });
    },
  },
};
