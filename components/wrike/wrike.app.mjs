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
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "The ID of the space",
      async options() {
        const { data: spaces } = await this.listSpaces();
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
        const { data: contacts } = await this.listContacts();
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
        const { data: tasks } = await this.listTasks({
          folderId,
          spaceId,
        });
        return tasks.map((task) => ({
          label: task.title,
          value: task.id,
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

      return this._makeRequest({
        path,
        method: "post",
        ...opts,
      });
    },
    async deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "delete",
        ...opts,
      });
    },
    async getFolder({
      folderId, ...opts
    }) {
      return this._makeRequest({
        path: `/folders/${folderId}`,
        ...opts,
      });
    },
    async listFolders({
      folderId, spaceId, ...opts
    } = {}) {
      const path = this._buildPath({
        basePath: "/folders",
        folderId,
        spaceId,
      });

      return this._makeRequest({
        path,
        ...opts,
      });
    },
    async listSpaces(opts = {}) {
      return this._makeRequest({
        path: "/spaces",
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
    async getTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/tasks/${taskId}`,
        ...opts,
      });
    },
    async getSubtasks({ taskId }) {
      const response = await this.getTask({
        taskId,
      });
      const task = response.data[0];
      const subtasks = await Promise.all(task.subTaskIds.map((subtaskId) => this.getTask({
        taskId: subtaskId,
      })));
      return subtasks.map((subtask) => subtask.data[0]);
    },
    async listTasks({
      folderId, spaceId, ...opts
    }) {
      const path = this._buildPath({
        basePath: "/tasks",
        folderId,
        spaceId,
      });

      return this._makeRequest({
        path,
        ...opts,
      });
    },
  },
};
