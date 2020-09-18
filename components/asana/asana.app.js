const axios = require("axios");
const crypto = require("crypto");

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
        return workspaces.map((workspace) => {
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
        return projects.map((project) => {
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
        return tasks.map((task) => {
          return { label: task.name, value: task.gid };
        });
      },
    },
    organizationId: {
      type: "string",
      label: "Organization",
      optional: false,
      async options(opts) {
        const organizations = await this.getOrganizations();
        return organizations.map((organization) => {
          return {
            label: organization.name,
            value: organization.gid,
          };
        });
      },
    },
  },
  methods: {
    async _getBaseUrl() {
      return "https://app.asana.com/api/1.0"
    },
    async _getHeaders() {
      return {
        Accept: "application/json",
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(endpoint) {
      config = {
        url: `${await this._getBaseUrl()}/${endpoint}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        }
      };
      try {
        return await axios(config);
      } catch (err) {
        console.log(err);
      }
    }, 
    async _getAuthorizationHeader({ data, method, url, headers }) {
      return await axios({
        method: "POST",
        url: `${await this._getBaseUrl()}/webhooks`,
        data: data.body,
        headers,
      });
    },
    async createHook(body) {
      const config = {
        method: "post",
        url: `${await this._getBaseUrl()}/webhooks`,
        headers: {
          "Content-Type": "applicaton/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data: {
          body,
        },
      };
      const authorization = await this._getAuthorizationHeader(config);
      config.headers.authorization = authorization;
      try {
        await axios(config);
      } catch (err) {
        console.log(err);
      }
      return authorization.data;
    },
    async deleteHook(hookId) {
      const config = {
        method: "delete",
        url: `${await this._getBaseUrl()}/webhooks/${hookId}`,
        headers: await this._getHeaders(),
      };
      try {
        await axios(config);
      } catch (err) {
        console.log(err);
      }
    },
    async verifyAsanaWebhookRequest(request) {
      let secret = this.$auth.oauth_refresh_token;
      var base64Digest = function (s) {
        return crypto.createHmac("sha1", secret).update(s).digest("base64");
      };
      var content = JSON.stringify(request.body);
      var doubleHash = base64Digest(content);
      var headerHash = request.headers["x-hook-secret"];
      return doubleHash === headerHash;
    },
    async getWorkspace(workspaceId) {
      return (await this._makeRequest(`workspaces/${workspaceId}`)).data.data;
    },
    async getWorkspaces() {
      return (await this._makeRequest("workspaces")).data.data;
    },
    async getOrganizations() {
      const organizations = [];
      const workspaces = await this.getWorkspaces();
      for (const workspace of workspaces) {
        let w = await this.getWorkspace(workspace.gid);
        if (w.is_organization) organizations.push(w);
      }
      return organizations;
    },
    async getProject(projectId) {
      return (await this._makeRequest(`projects/${projectId}`)).data.data;
    },
    async getProjects(workspaceId) {
      return (await this._makeRequest(`projects?workspace=${workspaceId}`)).data.data;
    },
    async getStory(storyId) {
      return (await this._makeRequest(`stories/${storyId}`)).data.data;
    },
    async getTask(taskId) {
      return (await this._makeRequest(`tasks/${taskId}`)).data.data;
    },
    async getTasks(projectId) {
      let incompleteTasks = [];
      const tasks = (await this._makeRequest(`projects/${projectId}/tasks`)).data.data;
      for (const task of tasks) {
        let t = await this.getTask(task.gid);
        if (t.completed == false) incompleteTasks.push(task);
      }
      return incompleteTasks;
    },
    async getTag(tagId) {
      return (await this._makeRequest(`tags/${tagId}`)).data.data;
    },
    async getTeam(teamId) {
      return (await this._makeRequest(`teams/${teamId}`)).data.data;
    },
    async getTeams(organizationId) {
      return (await this._makeRequest(`organizations/${organizationId}/teams`)).data.data;
    },
    async getUser(userId) {

      return (await this._makeRequest(`users/${userId}`)).data.data;
    },
    async getUsers(workspaceId) {
      return (await this._makeRequest(`workspaces/${workspaceId}/users`)).data.data;
    },
  },
};