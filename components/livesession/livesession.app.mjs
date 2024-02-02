import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "livesession",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The ID of the session",
    },
    userData: {
      type: "string",
      label: "User Data",
      description: "Data related to the user",
      optional: true,
    },
    sessionDuration: {
      type: "integer",
      label: "Session Duration",
      description: "The duration of the session in seconds",
      optional: true,
    },
    sessionSource: {
      type: "string",
      label: "Session Source",
      description: "The source of the session",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.livesession.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getSession(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: `/sessions/${opts.sessionId}`,
      });
    },
    async createSessionEvent(opts = {}) {
      const {
        sessionId,
        userData,
        sessionDuration,
        sessionSource,
      } = opts;

      const data = {
        session_id: sessionId,
        user_data: userData,
        session_duration: sessionDuration,
        session_source: sessionSource,
      };

      return this._makeRequest({
        method: "POST",
        path: "/session-events",
        data,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
