import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gloww",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session Id",
      description: "The Id of the session on which the new session is based.",
      async options() {
        const { sessions } = await this.listSuggestions();

        return sessions.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "The Id of the template on which the new session is based.",
      async options() {
        const { templates } = await this.listSuggestions();

        return templates.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.gloww.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    createSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/liveSessions",
        ...opts,
      });
    },
    listSuggestions(opts = {}) {
      return this._makeRequest({
        path: "/integrations/suggestions/sessions",
        ...opts,
      });
    },
  },
};
