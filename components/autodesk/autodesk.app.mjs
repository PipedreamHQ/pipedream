import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "autodesk",
  version: "0.0.{{ts}}",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace",
      description: "The workspace to monitor for new projects",
      async options() {
        const workspaces = await this.listWorkspaces();
        return workspaces.map((ws) => ({
          label: ws.name,
          value: ws.id,
        }));
      },
    },
    accountId: {
      type: "string",
      label: "Account",
      description: "The account to monitor for new projects",
      async options() {
        const accounts = await this.listAccounts();
        return accounts.map((acc) => ({
          label: acc.name,
          value: acc.id,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "The project to monitor or manage",
      async options({
        workspaceId, accountId,
      }) {
        const projects = await this.listProjects({
          workspaceId,
          accountId,
        });
        return projects.map((p) => ({
          label: p.name,
          value: p.id,
        }));
      },
    },
    folderId: {
      type: "string",
      label: "Folder",
      description: "The folder to monitor for new file uploads",
      async options({ projectId }) {
        const folders = await this.listFolders({
          projectId,
        });
        return folders.map((f) => ({
          label: f.name,
          value: f.id,
        }));
      },
    },
    fileId: {
      type: "string",
      label: "File",
      description: "The file to track versions or update metadata",
      async options({
        projectId, folderId,
      }) {
        const files = await this.listFiles({
          projectId,
          folderId,
        });
        return files.map((f) => ({
          label: f.name,
          value: f.id,
        }));
      },
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the new project",
    },
    projectDescription: {
      type: "string",
      label: "Project Description",
      description: "The description of the new project",
      optional: true,
    },
    targetWorkspaceId: {
      type: "string",
      label: "Target Workspace",
      description: "The workspace to associate the new project with",
      async options() {
        const workspaces = await this.listWorkspaces();
        return workspaces.map((ws) => ({
          label: ws.name,
          value: ws.id,
        }));
      },
      optional: true,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file to upload",
    },
    fileContent: {
      type: "string",
      label: "File Content",
      description: "The content of the file to upload",
    },
    metadata: {
      type: "string[]",
      label: "Metadata",
      description: "Key-value pairs for the file metadata to update (as JSON strings)",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://developer.api.autodesk.com"; // Replace with the actual base URL
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.access_token}`, // Adjust based on actual auth scheme
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    async listWorkspaces(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/project/v1/workspaces",
        ...opts,
      });
    },
    async listAccounts(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/project/v1/accounts",
        ...opts,
      });
    },
    async listProjects(opts = {}) {
      const {
        workspaceId, accountId,
      } = opts;
      const queryParams = {};
      if (workspaceId) queryParams.workspace_id = workspaceId;
      if (accountId) queryParams.account_id = accountId;
      return this._makeRequest({
        method: "GET",
        path: "/project/v1/projects",
        params: queryParams,
        ...opts,
      });
    },
    async listFolders(opts = {}) {
      const { projectId } = opts;
      return this._makeRequest({
        method: "GET",
        path: `/data/v1/projects/${projectId}/folders`,
        ...opts,
      });
    },
    async listFiles(opts = {}) {
      const {
        projectId, folderId,
      } = opts;
      const path = folderId
        ? `/data/v1/projects/${projectId}/folders/${folderId}/files`
        : `/data/v1/projects/${projectId}/files`;
      return this._makeRequest({
        method: "GET",
        path,
        ...opts,
      });
    },
    async createProject(opts = {}) {
      const {
        projectName, projectDescription, targetWorkspaceId,
      } = this;
      const data = {
        name: projectName,
        description: projectDescription,
        workspace_id: targetWorkspaceId,
      };
      return this._makeRequest({
        method: "POST",
        path: "/project/v1/projects",
        data,
        ...opts,
      });
    },
    async uploadFile(opts = {}) {
      const {
        projectId, folderId, fileName, fileContent,
      } = this;
      const path = folderId
        ? `/data/v1/projects/${projectId}/folders/${folderId}/files`
        : `/data/v1/projects/${projectId}/files`;
      const data = {
        name: fileName,
        content: fileContent,
      };
      return this._makeRequest({
        method: "POST",
        path,
        data,
        ...opts,
      });
    },
    async updateMetadata(opts = {}) {
      const {
        fileId, metadata,
      } = this;
      const metadataObj = metadata.reduce((acc, item) => {
        const parsed = JSON.parse(item);
        return {
          ...acc,
          ...parsed,
        };
      }, {});
      return this._makeRequest({
        method: "PATCH",
        path: `/data/v1/files/${fileId}/metadata`,
        data: metadataObj,
        ...opts,
      });
    },
    async createWebhook(opts = {}) {
      const {
        eventType, targetUrl, projectId, folderId, fileId,
      } = opts;
      const data = {
        event_type: eventType,
        callback_url: targetUrl,
        project_id: projectId,
        folder_id: folderId,
        file_id: fileId,
      };
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/v1/hooks",
        data,
        ...opts,
      });
    },
    async deleteWebhook(opts = {}) {
      const { webhookId } = opts;
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/v1/hooks/${webhookId}`,
        ...opts,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let hasMore = true;
      let page = 1;
      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          results = results.concat(response);
          page += 1;
        }
      }
      return results;
    },
  },
};
