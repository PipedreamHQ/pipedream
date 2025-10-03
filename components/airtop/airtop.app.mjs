import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airtop",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Select a browser session or provide a custom session ID",
      async options({ page }) {
        const limit = 10;
        const offset = page * limit;

        const data = await this.listSessions({
          params: {
            limit,
            offset,
          },
        });

        return {
          options: data.sessions.map((session) => ({
            label: `${session.id.substring(0, 8)}... (${session.status})`,
            value: session.id,
          })),
          context: {
            hasMore: data.pagination.hasMore,
          },
        };
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
        const data = await this.listWindows({
          sessionId,
        });
        return data.windows.map((window) => ({
          label: `Window ${window.windowId.substring(0, 8)}...`,
          value: window.windowId,
        }));
      },
    },
  },
  methods: {
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, headers, ...opts
    }) {
      const response = await axios($, {
        baseURL: "https://api.airtop.ai/api/v1",
        headers: {
          ...this._headers(),
          ...headers,
        },
        ...opts,
      });
      return response.data;
    },
    async createSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/sessions",
        ...opts,
      });
    },
    async listSessions(opts = {}) {
      return this._makeRequest({
        url: "/sessions",
        ...opts,
      });
    },
    async getSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        url: `/sessions/${sessionId}`,
        ...opts,
      });
    },
    async terminateSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        url: `/sessions/${sessionId}`,
        ...opts,
      });
    },
    async createWindow({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/sessions/${sessionId}/windows`,
        ...opts,
      });
    },
    async listWindows({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        url: `/sessions/${sessionId}/windows`,
        ...opts,
      });
    },
    async getWindow({
      sessionId, windowId, ...opts
    }) {
      return this._makeRequest({
        url: `/sessions/${sessionId}/windows/${windowId}`,
        ...opts,
      });
    },
    async loadUrl({
      sessionId, windowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/sessions/${sessionId}/windows/${windowId}`,
        ...opts,
      });
    },
    async queryPage({
      sessionId, windowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/sessions/${sessionId}/windows/${windowId}/page-query`,
        ...opts,
      });
    },
    async scrapeContent({
      sessionId, windowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/sessions/${sessionId}/windows/${windowId}/scrape-content`,
        ...opts,
      });
    },
    async saveProfileOnTermination({
      sessionId, profileName, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/sessions/${sessionId}/save-profile-on-termination/${profileName}`,
        ...opts,
      });
    },
  },
};
