const axios = require("axios");
const axiosRetry = require("axios-retry");

module.exports = {
  type: "app",
  app: "clickup",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "Workspace",
      async options() {
        const workspaces = (await this.getWorkspaces()).teams;
        return workspaces.map((workspace) => ({
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
        const spaces = (await this.getSpaces(workspace)).spaces;
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
        const folders = (await this.getFolders(space)).folders;
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
        const lists = folder
          ? (await this.getLists(folder)).lists
          : (await this.getFolderlessLists(space)).lists;
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
        const members = await this.getWorkspaceMembers(workspace);
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
      description:
        "Select the tags for the task to filter when searching for the tasks",
      async options({ space }) {
        const tags = (await this.getTags(space)).tags;
        return tags.map((tag) => tag.name);
      },
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Select the status of the task",
      async options({ list }) {
        const statuses = (await this.getList(list)).statuses;
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
        const tasks = (await this.getTasks(list, page)).tasks;
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
      description:
        `Pass an existing task ID in the parent property to make the new task a subtask of that parent. 
        The parent you pass must not be a subtask itself, and must be part of the specified list.`,
      async options({
        list, page,
      }) {
        const tasks = (await this.getTasks(list, page)).tasks;
        return tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
  },
  methods: {
    async _makeRequest(method, endpoint, data = null, params = null) {
      axiosRetry(axios, {
        retries: 3,
      });
      const config = {
        headers: {
          "content-type": "application/json",
          "Authorization": this.$auth.oauth_access_token,
        },
        method,
        url: `https://api.clickup.com/api/v2/${endpoint}`,
        params,
      };
      if (data) config.data = data;
      const response = await axios(config).catch((err) => {
        if (err.response.status !== 200) {
          throw new Error(`API call failed with status code: ${err.response.status} after 3 retry attempts`);
        }
      });
      return response.data;
    },
    async getWorkspaces() {
      return await this._makeRequest("GET", "team");
    },
    async getSpaces(workspaceId) {
      return await this._makeRequest(
        "GET",
        `team/${workspaceId}/space?archived=false`,
      );
    },
    async getFolders(spaceId) {
      return await this._makeRequest(
        "GET",
        `space/${spaceId}/folder?archived=false`,
      );
    },
    async getList(listId) {
      return await this._makeRequest("GET", `list/${listId}`);
    },
    async getLists(folderId) {
      return await this._makeRequest(
        "GET",
        `folder/${folderId}/list?archived=false`,
      );
    },
    async getFolderlessLists(spaceId) {
      return await this._makeRequest(
        "GET",
        `space/${spaceId}/list?archived=false`,
      );
    },
    async getWorkspaceMembers(workspaceId) {
      const { teams } = (await this.getWorkspaces());
      const workspace = teams.filter(
        (workspace) => workspace.id == workspaceId,
      );
      return workspace
        ? workspace[0].members
        : [];
    },
    async getTags(spaceId) {
      return await this._makeRequest("GET", `space/${spaceId}/tag`);
    },
    async getTasks(listId, page = 0) {
      return await this._makeRequest(
        "GET",
        `list/${listId}/task?archived=false&page=${page}`,
      );
    },
    async createTask(listId, data) {
      return await this._makeRequest("POST", `list/${listId}/task`, data);
    },
    async createList(folderId, data) {
      return await this._makeRequest("POST", `folder/${folderId}/list`, data);
    },
    async createFolderlessList(spaceId, data) {
      return await this._makeRequest("POST", `space/${spaceId}/list`, data);
    },
  },
};
