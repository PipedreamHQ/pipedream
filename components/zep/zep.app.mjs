import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zep",
  version: "0.0.{{ts}}",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "The workspace to monitor or target",
      async options() {
        const workspaces = await this.getWorkspaces();
        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace.id,
        }));
      },
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "The folder to monitor or target",
      async options({ workspace }) {
        if (!workspace) {
          return [];
        }
        const folders = await this.getFolders({
          workspaceId: workspace,
        });
        return folders.map((folder) => ({
          label: folder.name,
          value: folder.id,
        }));
      },
      optional: true,
    },
    document: {
      type: "string",
      label: "Document",
      description: "The document to monitor or target",
      async options({
        workspace, folder,
      }) {
        if (!workspace) {
          return [];
        }
        const documents = await this.getDocuments({
          workspaceId: workspace,
          folderId: folder,
        });
        return documents.map((doc) => ({
          label: doc.title,
          value: doc.id,
        }));
      },
      optional: true,
    },
    fieldsToTrack: {
      type: "string[]",
      label: "Fields to Track",
      description: "Fields to monitor for updates",
      options: [
        {
          label: "Title",
          value: "title",
        },
        {
          label: "Content",
          value: "content",
        },
        {
          label: "Metadata",
          value: "metadata",
        },
      ],
      optional: true,
    },
    title: {
      type: "string",
      label: "Document Title",
      description: "The title of the new document",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the new document",
    },
    commentContent: {
      type: "string",
      label: "Comment Content",
      description: "The content of the comment to add",
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document to update or comment on",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.getzep.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Api-Key ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          ...headers,
        },
        ...otherOpts,
      });
    },
    async getWorkspaces(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/workspaces",
        ...opts,
      });
    },
    async getFolders({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/workspaces/${workspaceId}/folders`,
        ...opts,
      });
    },
    async getDocuments({
      workspaceId, folderId, ...opts
    }) {
      let path = `/workspaces/${workspaceId}/documents`;
      if (folderId) {
        path += `?folderId=${folderId}`;
      }
      return this._makeRequest({
        method: "GET",
        path,
        ...opts,
      });
    },
    async createDocument({
      title, content, workspaceId, folderId, ...opts
    }) {
      const data = {
        title: this.title,
        content: this.content,
        workspaceId: this.workspace,
      };
      if (this.folder) {
        data.folderId = this.folder;
      }
      const response = await this._makeRequest({
        method: "POST",
        path: `/workspaces/${workspaceId}/documents`,
        data,
        ...opts,
      });
      this.emitDocumentCreated(response);
      return response;
    },
    async addComment({
      documentId, commentContent, ...opts
    }) {
      const data = {
        content: this.commentContent,
      };
      const response = await this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/comments`,
        data,
        ...opts,
      });
      this.emitCommentAdded(response);
      return response;
    },
    async updateDocument({
      documentId, fieldsToUpdate, ...opts
    }) {
      const data = {};
      if (this.fieldsToTrack && this.fieldsToTrack.includes("title")) {
        data.title = this.title;
      }
      if (this.fieldsToTrack && this.fieldsToTrack.includes("content")) {
        data.content = this.content;
      }
      if (this.fieldsToTrack && this.fieldsToTrack.includes("metadata")) {
        data.metadata = this.metadata;
      }
      const response = await this._makeRequest({
        method: "PATCH",
        path: `/documents/${documentId}`,
        data,
        ...opts,
      });
      this.emitDocumentUpdated(response);
      return response;
    },
    emitDocumentCreated(document) {
      this.$emit(document, {
        summary: `Document Created: ${document.title}`,
        id: document.id,
      });
    },
    emitCommentAdded(comment) {
      this.$emit(comment, {
        summary: `Comment Added: ${comment.content}`,
        id: comment.id,
      });
    },
    emitDocumentUpdated(document) {
      this.$emit(document, {
        summary: `Document Updated: ${document.title}`,
        id: document.id,
      });
    },
  },
};
