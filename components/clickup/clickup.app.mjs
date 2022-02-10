import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clickup",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "Workspace",
      async options() {
        const { teams } = await this.getWorkspaces({});
        return teams.map((workspace) => ({
          label: workspace.name,
          value: workspace.id,
        }));
      },
    },
    space: {
      type: "string",
      label: "Space",
      description: "Space",
      async options({ workspace }) {
        const { spaces } = await this.getSpaces({
          workspace,
        });
        return spaces.map((space) => ({
          label: space.name,
          value: space.id,
        }));
      },
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "Folder",
      async options({ space }) {
        const { folders } = await this.getFolders({
          space,
        });
        return folders.map((folder) => ({
          label: folder.name,
          value: folder.id,
        }));
      },
      optional: true,
    },
    list: {
      type: "string",
      label: "List",
      description: "List",
      async options({
        folder, space,
      }) {
        const { lists } = folder
          ? await this.getLists({
            folder,
          })
          : await this.getFolderlessLists({
            space,
          });
        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    assignees: {
      type: "string[]",
      label: "Assignees",
      description: "Select the assignees for the task",
      async options({ workspace }) {
        const members = await this.getWorkspaceMembers({
          workspace,
        });
        return members.map((member) => ({
          label: member.user.username,
          value: member.user.id,
        }));
      },
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Select the tags for the task to filter when searching for the tasks",
      async options({ space }) {
        const { tags } = await this.getTags({
          space,
        });
        return tags.map((tag) => tag.name);
      },
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Select the status of the task",
      async options({ list }) {
        const { statuses } = await this.getList({
          list,
        });
        return statuses.map((status) => status.status);
      },
      optional: true,
    },
    task: {
      type: "string",
      label: "Task",
      description: "Task",
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
    priority: {
      type: "integer",
      label: "Priority",
      description: `1 is Urgent
        2 is High
        3 is Normal
        4 is Low`,
      optional: true,
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
      optional: true,
    },
    dueDateTime: {
      type: "boolean",
      label: "Due Date Time",
      description: "Due Date Time",
      optional: true,
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
    async _makeRequest({
      method = "GET", endpoint, data, $,
    }) {
      const config = {
        headers: {
          "content-type": "application/json",
          "Authorization": this.$auth.oauth_access_token,
        },
        method,
        url: `https://api.clickup.com/api/v2/${endpoint}`,
      };
      if (data) {
        data = Object.entries(data).reduce((a, [
          k,
          v,
        ]) => (v
          ? (a[k] = v, a)
          : a), {});
        config.data = data;
      }
      const response = await axios($ || this, config).catch((err) => {
        if (err.response.status !== 200) {
          throw new Error(`API call failed with status code: ${err.response.status}`);
        }
      });
      return response;
    },
    async getWorkspaces({ $ }) {
      return this._makeRequest({
        endpoint: "team",
        $,
      });
    },
    async getSpaces({
      workspace, $,
    }) {
      return this._makeRequest({
        endpoint: `team/${workspace}/space?archived=false`,
        $,
      });
    },
    async getFolders({
      space, $,
    }) {
      return this._makeRequest({
        endpoint: `space/${space}/folder?archived=false`,
        $,
      });
    },
    async getList({
      list, $,
    }) {
      return this._makeRequest({
        endpoint: `list/${list}`,
        $,
      });
    },
    async getLists({
      folder, $,
    }) {
      return this._makeRequest({
        endpoint: `folder/${folder}/list?archived=false`,
        $,
      });
    },
    async getFolderlessLists({
      space, $,
    }) {
      return this._makeRequest({
        endpoint: `space/${space}/list?archived=false`,
        $,
      });
    },
    async getWorkspaceMembers({
      workspace: workspaceId, $,
    }) {
      const { teams } = (await this.getWorkspaces({
        $,
      }));
      const workspace = teams.filter(
        (workspace) => workspace.id == workspaceId,
      );
      return workspace
        ? workspace[0].members
        : [];
    },
    async getTags({
      space, $,
    }) {
      return this._makeRequest({
        endpoint: `space/${space}/tag`,
        $,
      });
    },
    async getTasks({
      list, page = 0, $,
    }) {
      return this._makeRequest({
        endpoint: `list/${list}/task?archived=false&page=${page}`,
        $,
      });
    },
    async createTask({
      list, data, $,
    }) {
      const config = {
        method: "POST",
        endpoint: `list/${list}/task`,
        data,
        $,
      };
      return this._makeRequest(config);
    },
    async createList({
      folder, data, $,
    }) {
      const config = {
        method: "POST",
        endpoint: `folder/${folder}/list`,
        data,
        $,
      };
      return this._makeRequest(config);
    },
    async createFolderlessList({
      space, data, $,
    }) {
      const config = {
        method: "POST",
        endpoint: `space/${space}/list`,
        data,
        $,
      };
      return this._makeRequest(config);
    },
  },
};
