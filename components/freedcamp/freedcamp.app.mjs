import { axios } from "@pipedream/platform";
import crypto from "crypto";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "freedcamp",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group ID",
      description: "ID of the group to create the project in",
      async options() {
        const { data } = await this.listGroups();
        return data.groups.map(({
          name: label, group_id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Select a project",
      async options() {
        const { data } = await this.listProjects();
        return data.projects.map(({
          project_name: label, project_id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskGroupId: {
      type: "string",
      label: "Task List",
      description: "Task list (group) to create the task in",
      optional: true,
      async options({ projectId }) {
        if (!projectId) return [];
        const { data } = await this.getTaskLists({
          params: {
            project_id: projectId,
          },
        });
        return data.lists.map(({
          title: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task",
      description: "Select a task",
      async options({
        projectId, page,
      }) {
        const { data } = await this.getTasks({
          params: {
            project_id: projectId,
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });
        return data.tasks.map(({
          title: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://freedcamp.com/api/v1";
    },
    _getAuthParams() {
      const apiKey = this.$auth.api_key;
      const apiSecret = this.$auth.api_secret;
      const timestamp = Math.floor(Date.now() / 1000);
      const hash = crypto
        .createHmac("sha1", apiSecret)
        .update(`${apiKey}${timestamp}`)
        .digest("hex");

      return {
        api_key: apiKey,
        timestamp,
        hash,
      };
    },
    async _makeRequest({
      $ = this, path, params = {}, ...opts
    }) {
      const auth = this._getAuthParams();
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          ...auth,
        },
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/groups",
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    getTaskLists(opts = {}) {
      return this._makeRequest({
        path: "/lists/2",
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        ...opts,
      });
    },
    addComment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/comments",
        ...opts,
      });
    },
    getTasks(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...opts,
      });
    },
  },
};
