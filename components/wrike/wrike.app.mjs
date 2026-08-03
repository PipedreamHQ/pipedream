// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wrike",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder. Run **List Folder ID Options** to look up folder IDs.",
    },
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "The ID of the space. Run **List Space ID Options** to look up space IDs.",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact ID of a user in the current account. Run **List Contact ID Options** to look up contact IDs.",
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task. Run **Find Tasks** or **Get Task** to look up task IDs.",
    },
    customFieldsKeys: {
      type: "string[]",
      label: "Custom Fields Keys",
      description: "The custom field IDs to set on the task. Run **List Custom Fields Keys Options** to discover valid field IDs.",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.host}/api/v4`;
    },
    _buildPath({
      basePath, folderId, spaceId,
    }) {
      if (folderId) {
        return `/folders/${folderId}` + basePath;
      }
      if (spaceId) {
        return `/spaces/${spaceId}` + basePath;
      }
      return basePath;
    },
    _extractResources(response) {
      return response.data;
    },
    _extractFirstResource(response) {
      return this._extractResources(response)[0];
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
    async createWebhook({
      folderId, spaceId, ...opts
    }) {
      const path = this._buildPath({
        basePath: "/webhooks",
        folderId,
        spaceId,
      });

      const response = await this._makeRequest({
        path,
        method: "post",
        ...opts,
      });

      return this._extractFirstResource(response);
    },
    async deleteWebhook({
      webhookId, ...opts
    }) {
      await this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "delete",
        ...opts,
      });
    },
    async getFolder({
      folderId, ...opts
    }) {
      const response = await this._makeRequest({
        path: `/folders/${folderId}`,
        ...opts,
      });
      return this._extractFirstResource(response);
    },
    async listFolders({
      folderId, spaceId, ...opts
    } = {}) {
      const path = this._buildPath({
        basePath: "/folders",
        folderId,
        spaceId,
      });

      const response = await this._makeRequest({
        path,
        ...opts,
      });

      return this._extractResources(response);
    },
    async listSpaces(opts = {}) {
      const response = await this._makeRequest({
        path: "/spaces",
        ...opts,
      });
      return this._extractResources(response);
    },
    async listContacts(opts = {}) {
      const response = await this._makeRequest({
        path: "/contacts",
        ...opts,
      });
      return this._extractResources(response);
    },
    async listCustomFields(opts = {}) {
      const response = await this._makeRequest({
        path: "/customfields",
        ...opts,
      });
      return this._extractResources(response);
    },
    async createTask({
      folderId, ...opts
    }) {
      const response = await this._makeRequest({
        path: `/folders/${folderId}/tasks`,
        method: "post",
        ...opts,
      });
      return this._extractFirstResource(response);
    },
    async updateTask({
      taskId, ...opts
    }) {
      const response = await this._makeRequest({
        path: `/tasks/${taskId}`,
        method: "put",
        ...opts,
      });
      return this._extractFirstResource(response);
    },
    async getTask({
      taskId, ...opts
    }) {
      const response = await this._makeRequest({
        path: `/tasks/${taskId}`,
        ...opts,
      });
      return this._extractFirstResource(response);
    },
    async getSubtasks({ taskId }) {
      const task = await this.getTask({
        taskId,
      });
      return Promise.all(task.subTaskIds.map((subtaskId) => this.getTask({
        taskId: subtaskId,
      })));
    },
    async listTasks({
      folderId, spaceId, ...opts
    }) {
      const path = this._buildPath({
        basePath: "/tasks",
        folderId,
        spaceId,
      });

      const response = await this._makeRequest({
        path,
        ...opts,
      });

      return this._extractResources(response);
    },
    async getTasks({
      taskIds, ...opts
    }) {
      const response = await this._makeRequest({
        path: `/tasks/${taskIds}`,
        ...opts,
      });
      return this._extractResources(response);
    },
    async createComment({
      taskId, ...opts
    }) {
      const response = await this._makeRequest({
        path: `/tasks/${taskId}/comments`,
        method: "post",
        ...opts,
      });
      return this._extractFirstResource(response);
    },
    async createFolder({
      folderId, ...opts
    }) {
      const response = await this._makeRequest({
        path: `/folders/${folderId}/folders`,
        method: "post",
        ...opts,
      });
      return this._extractFirstResource(response);
    },
    async updateFolder({
      folderId, ...opts
    }) {
      const response = await this._makeRequest({
        path: `/folders/${folderId}`,
        method: "put",
        ...opts,
      });
      return this._extractFirstResource(response);
    },
  },
};
