import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";
import _ from "lodash";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "clickup",
  propDefinitions: {
    workspaces: {
      type: "string",
      label: "Workspace",
      description: "The id of a workspace",
      async options() {
        const workspaces = await this.getWorkspaces();

        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace.id,
        }));
      },
    },
    spaces: {
      type: "string",
      label: "Space",
      description: "The id of a space",
      async options({ workspaceId }) {
        const spaces = await this.getSpaces({
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
      description: "The id of a folder",
      async options({ spaceId }) {
        const folders = [];
        if (spaceId) {
          folders.push(...await this.getFolders({
            spaceId,
          }));
        }
        return folders.map((folder) => ({
          label: folder.name,
          value: folder.id,
        }));
      },
    },
    lists: {
      type: "string",
      label: "List",
      description: "The id of a list",
      async options({
        workspaceId, folderId, spaceId,
      }) {
        const lists = [];

        if (!folderId && !spaceId) {
          lists.push(...await this.getAllLists({
            workspaceId,
          }));
        } else if (folderId) {
          lists.push(...await this.getLists({
            folderId,
          }));
        } else if (spaceId) {
          lists.push(...await this.getFolderlessLists({
            spaceId,
          }));
        }

        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    useCustomTaskIds: {
      type: "boolean",
      label: "Use custom task ids",
      description: "Whether it should use custom task id instead of the ClickUp task id. should be used with `Authorized Team`",
      optional: true,
    },
    authorizedTeamId: {
      type: "string",
      label: "Authorized Team",
      description: "The id of the authorized team. should be used with `Custom Task Id`",
      optional: true,
      async options() {
        const teams = await this.getAuthorizedTeams();

        return teams.map((team) => ({
          label: team.name,
          value: team.id,
        }));
      },
    },
    tasks: {
      type: "string",
      label: "Task",
      description: "The id of a task",
      async options({
        listId, page, useCustomTaskIds,
      }) {
        const tasks = await this.getTasks({
          listId,
          params: {
            page,
          },
        });

        const tasksHasCustomId = tasks.some((task) => task.custom_id);
        if (useCustomTaskIds && !tasksHasCustomId) {
          throw new ConfigurationError("Custom task id is a ClickApp, and it must to be enabled on ClickUp settings.");
        }

        return tasks.map((task) => ({
          label: task.name,
          value: useCustomTaskIds ?
            task.custom_id :
            task.id,
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
        const tags = await this.getTags({
          spaceId,
        });

        return tags.map((tag) => tag.name);
      },
    },
    checklists: {
      type: "string",
      label: "Checklist",
      description: "The id of a checklist",
      async options({
        taskId, useCustomTaskIds, authorizedTeamId,
      }) {
        if (!taskId) return [];

        const params = this.getParamsForCustomTaskIdCall(useCustomTaskIds, authorizedTeamId);

        const checklists = await this.getChecklists({
          taskId,
          params,
        });

        return checklists.map((checklist) => ({
          label: checklist.name,
          value: checklist.id,
        }));
      },
    },
    checklistItems: {
      type: "string",
      label: "Checklist Item",
      description: "The id of a checklist item",
      async options({
        taskId, checklistId, useCustomTaskIds, authorizedTeamId,
      }) {
        if (!taskId || !checklistId) return [];

        const params = this.getParamsForCustomTaskIdCall(useCustomTaskIds, authorizedTeamId);

        const items = await this.getChecklistItems({
          taskId,
          checklistId,
          params,
        });

        return items.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    comments: {
      type: "string",
      label: "Comment",
      description: "The id of a comment",
      async options({
        taskId, listId, viewId, useCustomTaskIds, authorizedTeamId,
      }) {
        if (!taskId && !listId && !viewId) {
          throw new ConfigurationError("Please enter the List, View, or Task to retrieve Comments from");
        }
        let comments = [];

        const params = this.getParamsForCustomTaskIdCall(useCustomTaskIds, authorizedTeamId);

        if (taskId) comments = comments.concat(await this.getTaskComments({
          taskId,
          params,
        }));
        if (listId) comments = comments.concat(await this.getListComments({
          listId,
        }));
        if (viewId) comments = comments.concat(await this.getViewComments({
          viewId,
        }));

        return comments.map((comment) => ({
          label: comment.comment_text,
          value: comment.id,
        }));
      },
    },
    views: {
      type: "string",
      label: "Views",
      description: "The id of a view",
      async options({
        workspaceId, spaceId, folderId, listId,
      }) {
        let views = [];

        if (workspaceId) views = views.concat(await this.getTeamViews({
          workspaceId,
        }));
        if (spaceId) views = views.concat(await this.getSpaceViews({
          spaceId,
        }));
        if (folderId) views = views.concat(await this.getFolderViews({
          folderId,
        }));
        if (listId) views = views.concat(await this.getListViews({
          listId,
        }));

        return views.map((view) => ({
          label: view.name,
          value: view.id,
        }));
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
        const templates = await this.getTaskTemplates({
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
        if (!listId) return [];

        const fields = await this.getCustomFields({
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
      options: Object.keys(constants.PRIORITIES),
      default: "Normal",
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

      return axios($ ?? this, config);
    },
    getParamsForCustomTaskIdCall(useCustomTaskIds, authorizedTeamId) {
      const params = {};
      if (useCustomTaskIds) {
        if (!authorizedTeamId) {
          throw new ConfigurationError("The prop \"Use Custom Task IDs\" must to be used with the prop \"Authorized Team\"");
        }
        params.custom_task_ids = useCustomTaskIds;
        params.team_id = authorizedTeamId;
      }
      return params;
    },
    async getWorkspaces({ $ } = {}) {
      const { teams } = await this._makeRequest("team", {}, $);

      return teams;
    },
    async getWorkspace({
      workspaceId, $,
    }) {
      const workspaces = await this.getWorkspaces({
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

      const { spaces } = await this._makeRequest(`team/${workspaceId}/space`, {
        params,
      }, $);

      return spaces;
    },
    async getSpace({
      spaceId, $,
    }) {
      return this._makeRequest(`space/${spaceId}`, {}, $);
    },
    async createSpace({
      workspaceId, data, $,
    }) {
      return this._makeRequest(`team/${workspaceId}/space`, {
        method: "POST",
        data,
      }, $);
    },
    async updateSpace({
      spaceId, data, $,
    }) {
      return this._makeRequest(`space/${spaceId}`, {
        method: "PUT",
        data,
      }, $);
    },
    async deleteSpace({
      spaceId, $,
    }) {
      return this._makeRequest(`space/${spaceId}`, {
        method: "DELETE",
      }, $);
    },
    async getFolders({
      spaceId, params, $,
    }) {
      if (!spaceId) return [];
      const { folders } = await this._makeRequest(`space/${spaceId}/folder`, {
        params,
      }, $);

      return folders;
    },
    async getFolder({
      folderId, $,
    }) {
      return this._makeRequest(`folder/${folderId}`, {}, $);
    },
    async createFolder({
      spaceId, data, $,
    }) {
      return this._makeRequest(`space/${spaceId}/folder`, {
        method: "POST",
        data,
      }, $);
    },
    async updateFolder({
      folderId, data, $,
    }) {
      return this._makeRequest(`folder/${folderId}`, {
        method: "PUT",
        data,
      }, $);
    },
    async deleteFolder({
      folderId, $,
    }) {
      return this._makeRequest(`folder/${folderId}`, {
        method: "DELETE",
      }, $);
    },
    async getAllLists({
      workspaceId, params, $,
    }) {
      const lists = [];
      const foldersPromises = [];

      const spaces = await this.getSpaces({
        workspaceId,
        params,
        $,
      });

      for (const { id: spaceId } of spaces) {
        foldersPromises.push(this.getFolders({
          spaceId,
        }));
        lists.push(...await this.getFolderlessLists({
          spaceId,
        }));
      }

      const folders = (await Promise.all(foldersPromises)).flat();
      for (const { id: folderId } of folders) {
        lists.push(...await this.getLists({
          folderId,
        }));
      }

      return lists;
    },
    async getLists({
      folderId, params, $,
    }) {
      if (!folderId) return [];
      const { lists } = await this._makeRequest(`folder/${folderId}/list`, {
        params,
      }, $);

      return lists;
    },
    async getFolderlessLists({
      spaceId, params, $,
    }) {
      if (!spaceId) return [];
      const { lists } = await this._makeRequest(`space/${spaceId}/list`, {
        params,
      }, $);

      return lists;
    },
    async getList({
      listId, $,
    }) {
      return this._makeRequest(`list/${listId}`, {}, $);
    },
    async createList({
      folderId, data, $,
    }) {
      return this._makeRequest(`folder/${folderId}/list`, {
        method: "POST",
        data,
      }, $);
    },
    async createFolderlessList({
      spaceId, data, $,
    }) {
      return this._makeRequest(`space/${spaceId}/list`, {
        method: "POST",
        data,
      }, $);
    },
    async updateList({
      listId, data, $,
    }) {
      return this._makeRequest(`list/${listId}`, {
        method: "PUT",
        data,
      }, $);
    },
    async deleteList({
      listId, $,
    }) {
      return this._makeRequest(`list/${listId}`, {
        method: "DELETE",
      }, $);
    },
    async getCustomFields({
      listId, $,
    }) {
      const { fields } = await this._makeRequest(`list/${listId}/field`, {}, $);

      return fields ?? [];
    },
    async getTaskTemplates({
      workspaceId, params, $,
    }) {
      if (!workspaceId) return [];
      const { templates } = await this._makeRequest(`team/${workspaceId}/taskTemplate`, {
        params,
      }, $);

      return templates;
    },
    async getTasks({
      listId, params, $,
    }) {
      if (!listId) return [];
      const { tasks } = await this._makeRequest(`list/${listId}/task`, {
        params,
      }, $);

      return tasks;
    },
    async getViewTasks({
      viewId, params, $,
    }) {
      if (!viewId) return [];
      const { tasks } = await this._makeRequest(`view/${viewId}/task`, {
        params,
      }, $);

      return tasks;
    },
    async getTask({
      taskId, $, params,
    }) {
      return this._makeRequest(`task/${taskId}`, {
        params,
      }, $);
    },
    async createTask({
      listId, data, $,
    }) {
      return this._makeRequest(`list/${listId}/task`, {
        method: "POST",
        data,
      }, $);
    },
    async createTaskFromTemplate({
      listId, taskTemplateId, data, $,
    }) {
      return this._makeRequest(`list/${listId}/taskTemplate/${taskTemplateId}`, {
        method: "POST",
        data,
      }, $);
    },
    async updateTask({
      taskId, data, $, params,
    }) {
      return this._makeRequest(`task/${taskId}`, {
        method: "PUT",
        data,
        params,
      }, $);
    },
    async updateTaskCustomField({
      taskId, customFieldId, data, $, params,
    }) {
      return this._makeRequest(`task/${taskId}/field/${customFieldId}`, {
        method: "POST",
        data,
        params,
      }, $);
    },
    async deleteTask({
      taskId, $, params,
    }) {
      return this._makeRequest(`task/${taskId}`, {
        method: "DELETE",
        params,
      }, $);
    },
    async removeTaskCustomField({
      taskId, customFieldId, $, params,
    }) {
      return this._makeRequest(`task/${taskId}/field/${customFieldId}`, {
        method: "DELETE",
        params,
      }, $);
    },
    async getTags({
      spaceId, $,
    }) {
      if (!spaceId) return [];
      const { tags } = await this._makeRequest(`space/${spaceId}/tag`, {}, $);

      return tags;
    },
    async getChecklists({
      taskId, $, params,
    }) {
      const { checklists } = await this.getTask({
        $,
        taskId,
        params,
      });

      return checklists;
    },
    async getChecklist({
      taskId, checklistId, $, params,
    }) {
      const checklists = await this.getChecklists({
        $,
        taskId,
        params,
      });

      return _.find(checklists, {
        id: checklistId,
      });
    },
    async createChecklist({
      taskId, data, $, params,
    }) {
      return this._makeRequest(`task/${taskId}/checklist`, {
        method: "POST",
        data,
        params,
      }, $);
    },
    async updateChecklist({
      checklistId, data, $,
    }) {
      return this._makeRequest(`checklist/${checklistId}`, {
        method: "PUT",
        data,
      }, $);
    },
    async deleteChecklist({
      checklistId, $,
    }) {
      return this._makeRequest(`checklist/${checklistId}`, {
        method: "DELETE",
      }, $);
    },
    async getChecklistItems({
      taskId, checklistId, $, params,
    }) {
      const { items } = await this.getChecklist({
        taskId,
        checklistId,
        $,
        params,
      });

      return items;
    },
    async createChecklistItem({
      checklistId, data, $,
    }) {
      return this._makeRequest(`checklist/${checklistId}/checklist_item`, {
        method: "POST",
        data,
      }, $);
    },
    async updateChecklistItem({
      checklistId, checklistItemId, data, $,
    }) {
      return this._makeRequest(`checklist/${checklistId}/checklist_item/${checklistItemId}`, {
        method: "PUT",
        data,
      }, $);
    },
    async deleteChecklistItem({
      checklistId, checklistItemId, $,
    }) {
      return this._makeRequest(`checklist/${checklistId}/checklist_item/${checklistItemId}`, {
        method: "DELETE",
      }, $);
    },
    async getTaskComments({
      taskId, $, params,
    }) {
      const { comments } = await this._makeRequest(`task/${taskId}/comment`, {
        params,
      }, $);

      return comments;
    },
    async getListComments({
      listId, $,
    }) {
      const { comments } = await this._makeRequest(`list/${listId}/comment`, {}, $);

      return comments;
    },
    async getViewComments({
      viewId, $,
    }) {
      const { comments } = await this._makeRequest(`view/${viewId}/comment`, {}, $);

      return comments;
    },
    async createTaskComment({
      taskId, data, $, params,
    }) {
      return this._makeRequest(`task/${taskId}/comment`, {
        method: "POST",
        data,
        params,
      }, $);
    },
    async createListComment({
      listId, data, $,
    }) {
      return this._makeRequest(`list/${listId}/comment`, {
        method: "POST",
        data,
      }, $);
    },
    async createViewComment({
      viewId, data, $,
    }) {
      return this._makeRequest(`view/${viewId}/comment`, {
        method: "POST",
        data,
      }, $);
    },
    async updateComment({
      commentId, data, $,
    }) {
      return this._makeRequest(`comment/${commentId}`, {
        method: "PUT",
        data,
      }, $);
    },
    async deleteComment({
      commentId, $,
    }) {
      return this._makeRequest(`comment/${commentId}`, {
        method: "DELETE",
      }, $);
    },
    async getTeamViews({
      workspaceId, $,
    }) {
      const { views } = await this._makeRequest(`team/${workspaceId}/view`, {}, $);

      return views;
    },
    async getAuthorizedTeams() {
      const { teams } = await this._makeRequest("team", {}, this);

      return teams;
    },
    async getSpaceViews({
      spaceId, $,
    }) {
      const { views } = await this._makeRequest(`space/${spaceId}/view`, {}, $);

      return views;
    },
    async getFolderViews({
      folderId, $,
    }) {
      const { views } = await this._makeRequest(`folder/${folderId}/view`, {}, $);

      return views;
    },
    async getListViews({
      listId, $,
    }) {
      const { views } = await this._makeRequest(`list/${listId}/view`, {}, $);

      return views;
    },
    async getView({
      viewId, $,
    }) {
      const { view } = await this._makeRequest(`view/${viewId}`, {}, $);

      return view;
    },
    async createHook(teamId, endpoint, events, $ = this) {
      return this._makeRequest(`team/${teamId}/webhook`, {
        method: "POST",
        data: {
          events,
          endpoint,
        },
      }, $);
    },
    async deleteHook(hookId, $ = this) {
      return this._makeRequest(`webhook/${hookId}`, {
        method: "DELETE",
      }, $);
    },
  },
};
