import { axios } from "@pipedream/platform";
import { PRIORITIES } from "./actions/common.mjs";

export default {
  type: "app",
  app: "clickup",
  propDefinitions: {
    workspaces: {
      type: "string",
      label: "Workspace",
      description: "The name of a workspace",
      async options() {
        const { teams } = await this.getWorkspaces({});

        return teams.map((workspace) => ({
          label: workspace.name,
          value: workspace.id,
        }));
      },
    },
    spaces: {
      type: "string",
      label: "Space",
      description: "The name of a space",
      async options({ workspaceId }) {
        const { spaces } = await this.getSpaces({
          workspaceId,
        });

        return spaces.map((space) => ({
          label: space.name,
          value: space.id,
        }));
      },
    },
    folders: {
      type: "string",
      label: "Folder",
      description: "The name of a folder",
      async options({ spaceId }) {
        const { folders } = await this.getFolders({
          spaceId,
        });
        return folders.map((folder) => ({
          label: folder.name,
          value: folder.id,
        }));
      },
    },
    lists: {
      type: "string",
      label: "List",
      description: "The name of a list",
      async options({
        folderId, spaceId,
      }) {
        const { lists } = folderId
          ? await this.getLists({
            folderId,
          })
          : await this.getFolderlessLists({
            spaceId,
          });

        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    tasks: {
      type: "string",
      label: "Task",
      description: "The of a task",
      async options({
        listId, page,
      }) {
        const { tasks } = await this.getTasks({
          listId,
          params: {
            page,
          },
        });

        return tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
    assignees: {
      type: "string[]",
      label: "Assignees",
      description: "Select the assignees",
      async options({ workspaceId }) {
        const members = await this.getWorkspaceMembers({
          workspaceId,
        });

        return members.map((member) => ({
          label: member.user.username,
          value: member.user.id,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Select the tags",
      async options({ spaceId }) {
        const { tags } = await this.getTags({
          spaceId,
        });

        return tags.map((tag) => tag.name);
      },
    },
    statuses: {
      type: "string",
      label: "Status",
      description: "Select a status",
      async options({ listId }) {
        const { statuses } = await this.getList({
          listId,
        });

        return statuses.map((status) => status.status);
      },
    },
    taskTemplates: {
      type: "string",
      label: "Task Templates",
      description: "Select a task template",
      async options({
        workspaceId, page,
      }) {
        const { templates } = await this.getTaskTemplates({
          workspaceId,
          params: {
            page,
          },
        });

        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },

    customFields: {
      type: "string",
      label: "Custom Field",
      description: "Select a custom field",
      async options({ listId }) {
        const { fields } = await this.getCustomFields({
          listId,
        });

        return fields.map((field) => ({
          label: field.name,
          value: field.id,
        }));
      },
    },
    priorities: {
      type: "string",
      label: "Priority",
      description: "The level of priority",
      options: Object.keys(PRIORITIES),
      default: "Normal",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name",
    },
    dueDate: {
      type: "integer",
      label: "Due Date",
      description: "Due Date",
    },
    dueDateTime: {
      type: "boolean",
      label: "Due Date Time",
      description: "Due Date Time",
    },
    parent: {
      type: "string",
      label: "Parent",
      description: "Pass an existing task ID in the parent property to make the new task a subtask of that parent. The parent you pass must not be a subtask itself, and must be part of the specified list.",
      async options({
        list, page,
      }) {
        const { tasks } = await this.getTasks({
          list,
          page,
        });
        return tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
  },
  methods: {
    /**
     * Get the access token;
     *
     * @returns {string} The access token.
     */
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    /**
     * Get the base url of Asana API;
     *
     * @returns {string} The Asana Api base url.
     */
    _apiUrl() {
      return "https://api.clickup.com/api/v2";
    },
    _headers() {
      return {
        Accept: "application/json",
        Authorization: this._accessToken(),
      };
    },
    /**
     * Make a requests with pre defined options.
     *
     * @param {string} path - The path to make the request.
     * @param {object} options - A default Axios options object.
     * @param {object} $ - A default Pipedream run object.
     *
     * @returns {string} The request result data.
     */
    async _makeRequest(path, options = {}, $) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._headers(),
        ...options,
      };

      return await axios($ ?? this, config);
    },

    async getWorkspaces({ $ }) {
      return this._makeRequest("team", {}, $);
    },

    async getWorkspace({
      workspaceId, $,
    }) {
      const { teams: workspaces } = await this.getWorkspaces({
        $,
      });

      const workspace = workspaces.filter((workspace) => workspace.id === workspaceId);

      return workspace[0] ?? null;
    },

    async getWorkspaceMembers({
      workspaceId, $,
    }) {
      const workspace = await this.getWorkspace({
        workspaceId,
        $,
      });

      return workspace.members;
    },

    async getSpaces({
      workspaceId, params, $,
    }) {
      if (!workspaceId) return [];

      return await this._makeRequest(`team/${workspaceId}/space`, {
        params,
      }, $);
    },

    async getSpace({
      spaceId, $,
    }) {
      return await this._makeRequest(`space/${spaceId}`, {}, $);
    },

    async createSpace({
      workspaceId, data, $,
    }) {
      return await this._makeRequest(`team/${workspaceId}/space`, {
        method: "POST",
        data,
      }, $);
    },

    async updateSpace({
      spaceId, data, $,
    }) {
      return await this._makeRequest(`space/${spaceId}`, {
        method: "PUT",
        data,
      }, $);
    },

    async deleteSpace({
      spaceId, $,
    }) {
      return await this._makeRequest(`space/${spaceId}`, {
        method: "DELETE",
      }, $);
    },

    async getFolders({
      spaceId, params, $,
    }) {
      if (!spaceId) return [];
      return await this._makeRequest(`space/${spaceId}/folder`, {
        params,
      }, $);
    },

    async getFolder({
      folderId, $,
    }) {
      return await this._makeRequest(`folder/${folderId}`, {}, $);
    },

    async createFolder({
      spaceId, data, $,
    }) {
      return await this._makeRequest(`space/${spaceId}/folder`, {
        method: "POST",
        data,
      }, $);
    },

    async updateFolder({
      folderId, data, $,
    }) {
      return await this._makeRequest(`folder/${folderId}`, {
        method: "PUT",
        data,
      }, $);
    },

    async deleteFolder({
      folderId, $,
    }) {
      return await this._makeRequest(`folder/${folderId}`, {
        method: "DELETE",
      }, $);
    },

    async getLists({
      folderId, params, $,
    }) {
      if (!folderId) return [];
      return await this._makeRequest(`folder/${folderId}/list`, {
        params,
      }, $);
    },

    async getFolderlessLists({
      spaceId, params, $,
    }) {
      if (!spaceId) return [];
      return await this._makeRequest(`space/${spaceId}/list`, {
        params,
      }, $);
    },

    async getList({
      listId, $,
    }) {
      return await this._makeRequest(`list/${listId}`, {}, $);
    },

    async createList({
      folderId, data, $,
    }) {
      return await this._makeRequest(`folder/${folderId}/list`, {
        method: "POST",
        data,
      }, $);
    },

    async createFolderlessList({
      spaceId, data, $,
    }) {
      return await this._makeRequest(`space/${spaceId}/list`, {
        method: "POST",
        data,
      }, $);
    },

    async updateList({
      listId, data, $,
    }) {
      return await this._makeRequest(`list/${listId}`, {
        method: "PUT",
        data,
      }, $);
    },

    async deleteList({
      listId, $,
    }) {
      return await this._makeRequest(`list/${listId}`, {
        method: "DELETE",
      }, $);
    },

    async getCustomFields({
      listId, $,
    }) {
      return this._makeRequest(`list/${listId}/field`, {}, $);
    },

    async getTaskTemplates({
      workspaceId, params, $,
    }) {
      if (!workspaceId) return [];
      return await this._makeRequest(`team/${workspaceId}/taskTemplate`, {
        params,
      }, $);
    },

    async getTasks({
      listId, params, $,
    }) {
      if (!listId) return [];
      return await this._makeRequest(`list/${listId}/task`, {
        params,
      }, $);
    },

    async getTask({
      taskId, $,
    }) {
      return await this._makeRequest(`task/${taskId}`, {}, $);
    },

    async createTask({
      listId, data, $,
    }) {
      return await this._makeRequest(`list/${listId}/task`, {
        method: "POST",
        data,
      }, $);
    },

    async createTaskFromTemplate({
      listId, taskTemplateId, data, $,
    }) {
      return await this._makeRequest(`list/${listId}/taskTemplate/${taskTemplateId}`, {
        method: "POST",
        data,
      }, $);
    },

    async updateTask({
      taskId, data, $,
    }) {
      return await this._makeRequest(`task/${taskId}`, {
        method: "PUT",
        data,
      }, $);
    },

    async updateTaskCustomField({
      taskId, customFieldId, data, $,
    }) {
      return await this._makeRequest(`task/${taskId}/field/${customFieldId}`, {
        method: "POST",
        data,
      }, $);
    },

    async deleteTask({
      taskId, $,
    }) {
      return await this._makeRequest(`task/${taskId}`, {
        method: "DELETE",
      }, $);
    },

    async removeTaskCustomField({
      taskId, customFieldId, $,
    }) {
      return await this._makeRequest(`task/${taskId}/field/${customFieldId}`, {
        method: "DELETE",
      }, $);
    },

    async getTags({
      spaceId, $,
    }) {
      if (!spaceId) return [];
      return await this._makeRequest(`space/${spaceId}/tag`, {}, $);
    },
  },
};
