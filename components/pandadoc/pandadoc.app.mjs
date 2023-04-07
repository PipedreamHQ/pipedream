import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pandadoc",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document Id",
      description: "Specify document's ID",
      async options() {
        const response = await this.listDocuments({
          params: {
            deleted: false,
          },
        });
        return response?.results?.map(({
          id,
          name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "Specify template's ID",
      async options() {
        const response = await this.listTemplates({
          params: {
            deleted: false,
          },
        });
        return response?.results?.map(({
          id,
          name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    documentFolderId: {
      type: "string",
      label: "Document Folder Id",
      description: "Specify the document folder ID",
      optional: true,
      async options() {
        const response = await this.listDocumentFolders();
        return response?.results?.map(({
          uuid,
          name,
        }) => ({
          label: name,
          value: uuid,
        })) || [];
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.pandadoc.com/public/v1${path}`;
    },
    getHeaders(headers = {}) {
      return {
        authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    makeRequest(customConfig) {
      const {
        $ = this,
        path,
        headers,
        ...otherConfig
      } = customConfig;

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...otherConfig,
      };
      return axios($, config);
    },
    listTemplates(args = {}) {
      return this.makeRequest({
        path: "/templates",
        ...args,
      });
    },
    listDocuments(args = {}) {
      return this.makeRequest({
        path: "/documents",
        ...args,
      });
    },
    listDocumentFolders(args = {}) {
      return this.makeRequest({
        path: "/documents/folders",
        ...args,
      });
    },
    documentDetails(args = {}) {
      return this.makeRequest({
        path: `/documents/${args.id}/details`,
        ...args,
      });
    },
    listDocumentAttachments(args = {}) {
      return this.makeRequest({
        path: `/documents/${args.documentId}/attachments`,
        ...args,
      });
    },
    createDocumentAttachments(args = {}) {
      return this.makeRequest({
        path: `/documents/${args.documentId}/attachments`,
        method: "POST",
        ...args,
      });
    },
    createDocumentFromTemplate(args = {}) {
      return this.makeRequest({
        path: "/documents",
        method: "POST",
        ...args,
      });
    },
    createFolder(args = {}) {
      return this.makeRequest({
        path: "/documents/folders",
        method: "POST",
        ...args,
      });
    },
    createOrUpdateContact(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        ...args,
      });
    },
  },
};
