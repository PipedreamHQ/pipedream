import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "papersign",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "Enter the ID of the Papersign document",
      async options() {
        const documents = await this.listDocuments();
        return documents.map((doc) => ({
          value: doc.id,
          label: doc.name,
        }));
      },
    },
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "Enter the ID of the Papersign space",
      async options() {
        const spaces = await this.listSpaces();
        return spaces.map((space) => ({
          value: space.id,
          label: space.name,
        }));
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Enter the ID of the Papersign folder",
      async options() {
        const folders = await this.listFolders();
        return folders.map((folder) => ({
          value: folder.id,
          label: folder.name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.paperform.co/v1/papersign";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listDocuments(opts = {}) {
      return this._makeRequest({
        path: "/documents",
        ...opts,
      });
    },
    async listSpaces(opts = {}) {
      return this._makeRequest({
        path: "/spaces",
        ...opts,
      });
    },
    async listFolders(opts = {}) {
      const { spaceId } = opts;
      return this._makeRequest({
        path: "/folders",
        params: spaceId
          ? {
            space_id: spaceId,
          }
          : {},
        ...opts,
      });
    },
    async duplicateDocument({
      documentId, name, spaceId, path, folderId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/copy`,
        data: {
          name,
          space_id: spaceId,
          path,
          folder_id: folderId,
        },
      });
    },
    async getDocument({ documentId }) {
      return this._makeRequest({
        path: `/documents/${documentId}`,
      });
    },
    async sendDocument({
      documentId, expiration, inviteMessage, fromUserEmail, documentRecipientEmails, automaticReminders, signers, variables, copy,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/send`,
        data: {
          expiration,
          invite_message: inviteMessage,
          from_user_email: fromUserEmail,
          document_recipient_emails: documentRecipientEmails,
          automatic_reminders: automaticReminders,
          signers,
          variables,
          copy,
        },
      });
    },
  },
};
