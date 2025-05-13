import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wakatime",
  propDefinitions: {
    project: {
      type: "string",
      label: "Project",
      description: "The name of a project",
      optional: true,
      async options() {
        const { data } = await this.listProjects();
        return data?.map(({ name }) => name) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://wakatime.com/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/users/current/projects",
        ...opts,
      });
    },
    listHeartbeats(opts = {}) {
      return this._makeRequest({
        path: "/users/current/heartbeats",
        ...opts,
      });
    },
    createHeartbeat(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users/current/heartbeats",
        ...opts,
      });
    },
  },
};
