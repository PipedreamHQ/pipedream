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
    async _getHeaders() {
      return {
        Accept: "application/json",
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
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
      return doubleHash == headerHash;
    },
    async getWorkspace(workspaceId) {
      const workspace = await axios.get(
        `https://app.asana.com/api/1.0/workspaces/${workspaceId}`,
        {
          headers: await this._getHeaders(),
        }
      );
      return workspace.data.data;
    },
    async getWorkspaces() {
      const workspaces = await axios.get(
        `https://app.asana.com/api/1.0/workspaces/`,
        {
          headers: await this._getHeaders(),
        }
      );
      return workspaces.data.data;
    },
    async getOrganizations() {
      let organizations = [];
      const workspaces = await this.getWorkspaces();
      for (const workspace of workspaces) {
        let w = await this.getWorkspace(workspace.gid);
        if (w.is_organization) organizations.push(w);
      }
      return organizations;
    },
    async getProject(projectId) {
      const project = await axios.get(
        `https://app.asana.com/api/1.0/projects/${projectId}`,
        {
          headers: await this._getHeaders(),
        }
      );
      return project.data.data;
    },
    async getProjects(workspaceId) {
      const projects = await axios.get(
        `https://app.asana.com/api/1.0/projects?workspace=${workspaceId}`,
        {
          headers: await this._getHeaders(),
        }
      );
      return projects.data.data;
    },
    async getStory(storyId) {
      const story = await axios.get(
        `https://app.asana.com/api/1.0/stories/${storyId}`,
        {
          headers: await this._getHeaders(),
        }
      );
      return story.data.data;
    },
    async getTask(taskId) {
      const task = await axios.get(
        `https://app.asana.com/api/1.0/tasks/${taskId}`,
        {
          headers: await this._getHeaders(),
        }
      );
      return task.data.data;
    },
    async getTasks(projectId) {
      let incompleteTasks = [];
      const tasks = await axios.get(
        `https://app.asana.com/api/1.0/projects/${projectId}/tasks`,
        {
          headers: await this._getHeaders(),
        }
      );
      for (const task of tasks.data.data) {
        let t = await this.getTask(task.gid);
        if (t.completed == false) incompleteTasks.push(task);
      }
      return incompleteTasks;
    },
    async getTag(tagId) {
      const tag = await axios.get(
        `https://app.asana.com/api/1.0/tags/${tagId}`,
        {
          headers: await this._getHeaders(),
        }
      );
      return tag.data.data;
    },
    async getTeam(teamId) {
      const team = await axios.get(
        `https://app.asana.com/api/1.0/teams/${teamId}`,
        {
          headers: await this._getHeaders(),
        }
      );
      return team.data.data;
    },
    async getTeams(organizationId) {
      const teams = await axios.get(
        `https://app.asana.com/api/1.0/organizations/${organizationId}/teams`,
        {
          headers: await this._getHeaders(),
        }
      );
      return teams.data.data;
    },
    async getUser(userId) {
      const user = await axios.get(
        `https://app.asana.com/api/1.0/users/${userId}`,
        {
          headers: await this._getHeaders(),
        }
      );
      return user.data.data;
    },
    async getUsers(workspaceId) {
      const users = await axios.get(
        `https://app.asana.com/api/1.0/workspaces/${workspaceId}/users`,
        {
          headers: await this._getHeaders(),
        }
      );
      return users.data.data;
    },
  },
};