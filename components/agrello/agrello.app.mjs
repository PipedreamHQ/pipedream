import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agrello",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder",
      async options() {
        const folders = await this.listFolders();
        return folders.map((folder) => ({
          label: folder.name,
          value: folder.id,
        }));
      },
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document",
      async options() {
        const documents = await this.listDocuments();
        return documents.map((document) => ({
          label: document.name,
          value: document.id,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template",
      optional: true,
      async options() {
        const templates = await this.listTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    file: {
      type: "string",
      label: "File",
      description: "The file to upload",
    },
    name: {
      type: "string",
      label: "Document Name",
      description: "The name of the document",
    },
    outputType: {
      type: "string",
      label: "Output Type",
      description: "The output type of the document",
      options: [
        "pdf",
        "asice",
        "zip",
      ],
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "The variables for the document",
    },
    signers: {
      type: "string[]",
      label: "Signers",
      description: "The signers of the document",
    },
    viewers: {
      type: "string[]",
      label: "Viewers",
      description: "The viewers of the document",
    },
    immediatePublish: {
      type: "boolean",
      label: "Immediate Publish",
      description: "Whether to publish the document immediately",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "The metadata for the document",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.agrello.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listFolders() {
      return this._makeRequest({
        path: "/v3/folders",
      });
    },
    async listDocuments() {
      return this._makeRequest({
        path: "/v3/documents",
      });
    },
    async listTemplates() {
      return this._makeRequest({
        path: "/v3/templates",
      });
    },
    async uploadDocument({
      folderId, file,
    }) {
      const formData = new FormData();
      formData.append("file", file);
      return this._makeRequest({
        method: "POST",
        path: `/folders/${folderId}/documents`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    async getDocument({ documentId }) {
      return this._makeRequest({
        path: `/documents/${documentId}`,
      });
    },
    async createDocument({
      folderId,
      name,
      outputType,
      variables,
      signers,
      viewers,
      immediatePublish,
      metadata,
      templateId,
    }) {
      const data = {
        folderId,
        name,
        outputType,
        variables,
        signers,
        viewers,
        immediatePublish,
        metadata,
        templateId,
      };
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        data,
      });
    },
    async emitDocumentSignatureAdded() {
      // Implementation to emit event when a signature is added to a document
    },
    async emitDocumentSigned() {
      // Implementation to emit event when a document is signed by all parties
    },
    async emitUserAddedDocumentToFolder({ folderId }) {
      // Implementation to emit event when a user adds a document to a specific folder
    },
  },
};
