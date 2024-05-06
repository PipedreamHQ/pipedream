import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clickhelp",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Identifier of a project",
      async options() {
        const projects = await this.listProjects();
        return projects?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    nodeIds: {
      type: "string[]",
      label: "Node IDs",
      description: "An array of strings containing IDs of the TOC nodes to publish. If not specified, the entire project is published.",
      optional: true,
      async options({ projectId }) {
        const nodes = await this.listNodes({
          projectId,
        });
        return nodes?.map(({
          id: value, topicId: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "The username of a user",
      async options() {
        const users = await this.listUsers();
        return users?.map(({ userName }) => userName) || [];
      },
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the task is completed",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.portal_domain}/api/v1`;
    },
    _auth() {
      return {
        username: `${this.$auth.email}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listNodes({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/toc/nodes`,
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listTopics({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/articles`,
        ...opts,
      });
    },
    getTaskStatus({
      taskKey, ...opts
    }) {
      return this._makeRequest({
        path: `/tasks/${taskKey}`,
        ...opts,
      });
    },
    createProjectBackup({
      projectId, params, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}`,
        params: {
          ...params,
          action: "download",
        },
        ...opts,
      });
    },
    createPublication({
      projectId, params, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}`,
        params: {
          ...params,
          action: "publish",
        },
        ...opts,
      });
    },
    createTopic({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/articles`,
        ...opts,
      });
    },
  },
};
