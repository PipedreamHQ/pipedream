import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airtop",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Select a browser session or provide a custom session ID",
      async options() {
        const { data } = await this.listSessions();
        console.log(data);
        return data.map((session) => ({
          label: `${session.id.substring(0, 8)}... (${session.status})`,
          value: session.id,
        }));
      },
    },
    windowId: {
      type: "string",
      label: "Window ID",
      description: "Select a browser window or provide a custom window ID",
      async options({ sessionId }) {
        if (!sessionId) {
          return [];
        }
        const { data } = await this.listWindows({
          sessionId,
        });
        return data.map((window) => ({
          label: `Window ${window.id.substring(0, 8)}...`,
          value: window.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.airtop.ai/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    async createSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sessions",
        ...opts,
      });
    },
    async listSessions(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/sessions",
        ...opts,
      });
    },
    async getSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/sessions/${sessionId}`,
        ...opts,
      });
    },
    async terminateSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/sessions/${sessionId}`,
        ...opts,
      });
    },
    async createWindow({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sessions/${sessionId}/windows`,
        ...opts,
      });
    },
    async listWindows({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/sessions/${sessionId}/windows`,
        ...opts,
      });
    },
    async getWindow({
      sessionId, windowId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/sessions/${sessionId}/windows/${windowId}`,
        ...opts,
      });
    },
    async loadUrl({
      sessionId, windowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sessions/${sessionId}/windows/${windowId}`,
        ...opts,
      });
    },
    async queryPage({
      sessionId, windowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sessions/${sessionId}/windows/${windowId}/page-query`,
        ...opts,
      });
    },
    async scrapeContent({
      sessionId, windowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sessions/${sessionId}/windows/${windowId}/scrape-content`,
        ...opts,
      });
    },
    async saveProfileOnTermination({
      sessionId, profileName, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/sessions/${sessionId}/save-profile-on-termination/${profileName}`,
        ...opts,
      });
    },
  },
};
