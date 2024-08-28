import { axios } from "@pipedream/platform";
import { DOCUMENT_STATUS_COMPLETED } from "./common/constants.mjs";

export default {
  type: "app",
  app: "pandadoc",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document Id",
      description: "Specify document's ID",
      async options({ page }) {
        const response = await this.listDocuments({
          params: {
            deleted: false,
            page: page || undefined,
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
    completedDocumentId: {
      type: "string",
      label: "Completed Document Id",
      description: "Select a completed document or provide its ID",
      async options({ page }) {
        const response = await this.listDocuments({
          params: {
            deleted: false,
            status: DOCUMENT_STATUS_COMPLETED,
            page: page || undefined,
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
      async options({ page }) {
        const response = await this.listTemplates({
          params: {
            deleted: false,
            page: page || undefined,
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
      async options({ page }) {
        const response = await this.listDocumentFolders({
          params: {
            page: page || undefined,
          },
        });
        return response?.results?.map(({
          uuid,
          name,
        }) => ({
          label: name,
          value: uuid,
        })) || [];
      },
    },
    file: {
      type: "string",
      label: "File",
      description: "The file to upload from the `/tmp` folder. [See the docs here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp) on how to upload a file to `/tmp`.",
    },
    name: {
      type: "string",
      label: "Document Name",
      description: "Specify the document's name.",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: `The list of recipients you're sending the document to. Every object must contain the email parameter. 
      The role, first_name and last_name parameters are optional. If the role parameter passed, a person is assigned all fields matching their corresponding role. 
      If not passed, a person will receive a read-only link to view the document. 
      If the first_name and last_name not passed the system: 1. creates a new contact, 
      if none exists with the given email; or 2. gets the existing contact with the given email that already exists.
      \n\nE.g. \`{ "email": "john.doe@pipedream.com", "first_name": "John", "last_name": "Doe", "role": "user" }\``,
    },
    separateFiles: {
      type: "boolean",
      label: "Separate Files",
      description: "Download document bundle as a zip-archive of separate PDFs (1 file per section)",
      optional: true,
    },
    outputFilename: {
      type: "string",
      label: "Output Filename",
      description: "The filename of the downloaded file in the `tmp` folder.",
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
    getTemplate({
      templateId, ...args
    }) {
      return this.makeRequest({
        path: `/templates/${templateId}/details`,
        ...args,
      });
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
    createDocument(args = {}) {
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
    createHook(args = {}) {
      return this.makeRequest({
        path: "/webhook-subscriptions",
        method: "POST",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this.makeRequest({
        path: `/webhook-subscriptions/${hookId}`,
        method: "DELETE",
      });
    },
    sendDocument(args = {}) {
      return this.makeRequest({
        path: `/documents/${args.documentId}/send`,
        method: "POST",
        ...args,
      });
    },
    getDocument({
      id, ...args
    }) {
      return this.makeRequest({
        path: `/documents/${id}`,
        ...args,
      });
    },
    downloadDocument({
      id, ...args
    }) {
      return this.makeRequest({
        path: `/documents/${id}/download`,
        responseType: "arraybuffer",
        ...args,
      });
    },
    downloadProtectedDocument({
      id, ...args
    }) {
      return this.makeRequest({
        path: `/documents/${id}/download-protected`,
        responseType: "arraybuffer",
        ...args,
      });
    },
  },
};
