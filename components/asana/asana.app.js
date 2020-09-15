const axios = require("axios");

module.exports = {
  type: "app",
  app: "asana",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace",
      optional: false,
      async options(opts) {
        const workspaces = await this.getWorkspaces();
        return workspaces.data.data.map((workspace) => {
          return {
            label: workspace.name,
            value: workspace.gid,
          };
        });
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      optional: false,
      async options(opts) {
        const projects = await this.getProjects(opts.workspaceId);
        return projects.data.data.map((project) => {
          return {
            label: project.name,
            value: project.gid,
          };
        });
      },
    },
    taskIds: {
      type: "string[]",
      label: "Tasks",
      async options(opts) {
        const tasks = await this.getTasks(opts.projectId);
        return tasks.data.data.map((task) => {
          return { label: task.name, value: task.gid };
        });
      },
    },
  },
  methods: {
    async _getAuthorizationHeader({ data, method, url, headers }) {
      const token = {
        key: this.$auth.oauth_access_token,
        secret: this.$auth.oauth_refresh_token,
      };
      return await axios({
        method: "POST",
        url: `https://app.asana.com/api/1.0/webhooks`,
        data: data.body,
        headers,
      });
    },
    async _makeWebhookRequest(config) {
      if (!config.headers) config.headers = {};
      const authorization = await this._getAuthorizationHeader(config);
      config.headers.authorization = authorization;
      try {
        await axios(config);
      } catch (err) {
        console.log(err);
      }
      return authorization.data;
    },
    async createHook(body) {
      const resp = await this._makeWebhookRequest({
        method: "post",
        url: `https://app.asana.com/api/1.0/webhooks`,
        headers: {
          "Content-Type": "applicaton/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data: {
          body,
        },
      });
      return resp;
    },
    async deleteHook(hookId) {
      const config = {
        method: "delete",
        url: `https://app.asana.com/api/1.0/webhooks/${hookId}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      };
      try {
        await axios(config);
      } catch (err) {
        console.log(err);
      }
    },
    async getWorkspace(workspaceId) {
      return await axios.get(`https://app.asana.com/api/1.0/workspaces/${workspaceId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getWorkspaces() {
      return await axios.get(`https://app.asana.com/api/1.0/workspaces/`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getProject(projectId) {
      return await axios.get(
        `https://app.asana.com/api/1.0/projects/${projectId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
        }
      );
    },
    async getProjects(workspaceId) {
      return await axios.get(
        `https://app.asana.com/api/1.0/projects?workspace=${workspaceId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
        }
      );
    },
    async getStory(storyId) {
      return await axios.get(`https://app.asana.com/api/1.0/stories/${storyId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getTask(taskId) {
      return await axios.get(`https://app.asana.com/api/1.0/tasks/${taskId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getTasks(projectId) {
      return await axios.get(
        `https://app.asana.com/api/1.0/projects/${projectId}/tasks`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
        }
      );
    },
    async getTag(tagId) {
      return await axios.get(`https://app.asana.com/api/1.0/tags/${tagId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getUser(userId) {
      return await axios.get(`https://app.asana.com/api/1.0/users/${userId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getUsers(workspaceId) {
      return await axios.get(`https://app.asana.com/api/1.0/workspaces/${workspaceId}/users`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
  },
};
