import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lambdatest",
  propDefinitions: {
    buildId: {
      type: "string",
      label: "Build ID",
      description: "The ID of the automation build",
      async options({ page }) {
        const { builds } = await this.listBuilds({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });

        return (builds ?? []).map(({
          build_id: value, name,
        }) => ({
          label: name || `Build ${value}`,
          value: String(value),
        }));
      },
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The ID of the automation session",
      async options({ page }) {
        const { data } = await this.listSessions({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });

        return (data ?? []).map(({
          test_id: value, name,
        }) => ({
          label: name || `Session ${value}`,
          value: String(value),
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lambdatest.com/automation/api/v1";
    },
    _auth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.access_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...opts,
      });
    },
    listBuilds(opts = {}) {
      return this._makeRequest({
        path: "/builds",
        ...opts,
      });
    },
    getBuild({
      buildId, ...opts
    }) {
      return this._makeRequest({
        path: `/builds/${buildId}`,
        ...opts,
      });
    },
    listSessions(opts = {}) {
      return this._makeRequest({
        path: "/sessions",
        ...opts,
      });
    },
    getSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        path: `/sessions/${sessionId}`,
        ...opts,
      });
    },
  },
};
