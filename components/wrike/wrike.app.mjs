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
        const folders = await this.listFolders();
        return folders.map((folder) => ({
          label: folder.title,
          value: folder.id,
        }));
      },
    },
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "The ID of the space",
      async options() {
        const spaces = await this.listSpaces();
        return spaces.map((space) => ({
          label: space.title,
          value: space.id,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact of a user in the current account",
      async options() {
        const contacts = await this.listContacts();
        return contacts.map((contact) => ({
          label: `${contact.firstName} ${contact.lastName}`,
          value: contact.id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({
        folderId, spaceId,
      }) {
        const tasks = await this.listTasks({
          folderId,
          spaceId,
        });
        return tasks.map((task) => ({
          label: task.title,
          value: task.id,
        }));
      },
    },
    customFieldsKeys: {
      type: "string[]",
      label: "Custom Fields Keys",
      description: "The custom field keys to set on the task",
      async options() {
        const customFields = await this.listCustomFields();
        return customFields.map((customField) => ({
          label: customField.title,
          value: customField.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.wrike.com/api/v4";
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
  },
};
