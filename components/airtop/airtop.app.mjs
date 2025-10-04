import { axios } from "@pipedream/platform";
import { formatTimeAgo } from "./common/utils.mjs";

export default {
  type: "app",
  app: "airtop",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Select a session or provide a session ID. Note that only actively running sessions are listed in the options",
      async options({ page = 0 }) {
        const limit = 10;
        const offset = page * limit;

        const data = await this.listSessions({
          params: {
            status: "running",
            limit,
            offset,
          },
        });

        return data.sessions.map(({
          id, dateCreated, lastActivity,
        }) => ({
          label: `${id.slice(0, 8)} last active ${formatTimeAgo(lastActivity)} (created ${formatTimeAgo(dateCreated)})`,
          value: id,
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
        const data = await this.listWindows({
          sessionId,
        });
        return data.windows.map((window) => ({
          label: `Window ${window.windowId.substring(0, 8)}...`,
          value: window.windowId,
        }));
      },
    },
    waitUntil: {
      type: "string",
      label: "Wait Until",
      description: "Wait until the specified loading event occurs. Defaults to `load`.",
      options: [
        {
          label: "Load - Wait until the page DOM and its assets have loaded",
          value: "load",
        },
        {
          label: "DOM Content Loaded - Wait until the DOM has loaded",
          value: "domContentLoaded",
        },
        {
          label: "Complete - Wait until the page and all its iframes have loaded",
          value: "complete",
        },
        {
          label: "No Wait - Return immediately without waiting",
          value: "noWait",
        },
      ],
      optional: true,
      default: "load",
    },
    waitUntilTimeoutSeconds: {
      type: "integer",
      label: "\"Wait Until\" Timeout (seconds)",
      description: "Maximum time in seconds to wait for the specified loading event to occur. If the timeout is reached, the operation will still succeed but return a warning.",
      optional: true,
      default: 30,
    },
    followPaginationLinks: {
      type: "boolean",
      label: "Follow Pagination Links",
      description: "If true, a best effort attempt to load more content items than are originally displayed on the page will be made. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/windows/page-query) for more information",
      optional: true,
      default: false,
    },
    costThresholdCredits: {
      type: "integer",
      label: "Cost Threshold (Credits)",
      description: "A credit threshold that, once exceeded, will cause the operation to be cancelled. [See the documentation](https://docs.airtop.ai/guides/misc/faq#how-does-the-credit-system-work) for more information.",
      optional: true,
    },
    timeThresholdSeconds: {
      type: "integer",
      label: "Time Threshold (Seconds)",
      description: "A time threshold that, once exceeded, will cause the operation to be cancelled. This is checked periodically. Set to 0 to disable (not recommended).",
      optional: true,
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
      $ = this, headers, ...args
    }) {
      const response = await axios($, {
        baseURL: "https://api.airtop.ai/api/v1",
        headers: {
          ...this._headers(),
          ...headers,
        },
        ...args,
      });
      return response.data;
    },
    async createSession(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/sessions",
        ...args,
      });
    },
    async listSessions(args = {}) {
      return this._makeRequest({
        url: "/sessions",
        ...args,
      });
    },
    async getSession({
      sessionId, ...args
    }) {
      return this._makeRequest({
        url: `/sessions/${sessionId}`,
        ...args,
      });
    },
    async endSession({
      sessionId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        url: `/sessions/${sessionId}`,
        ...args,
      });
    },
    async createWindow({
      sessionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/sessions/${sessionId}/windows`,
        ...args,
      });
    },
    async listWindows({
      sessionId, ...args
    }) {
      return this._makeRequest({
        url: `/sessions/${sessionId}/windows`,
        ...args,
      });
    },
    async getWindow({
      sessionId, windowId, ...args
    }) {
      return this._makeRequest({
        url: `/sessions/${sessionId}/windows/${windowId}`,
        ...args,
      });
    },
    async loadUrl({
      sessionId, windowId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/sessions/${sessionId}/windows/${windowId}`,
        ...args,
      });
    },
    async queryPage({
      sessionId, windowId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/sessions/${sessionId}/windows/${windowId}/page-query`,
        ...args,
      });
    },
    async scrapeContent({
      sessionId, windowId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/sessions/${sessionId}/windows/${windowId}/scrape-content`,
        ...args,
      });
    },
    async saveProfileOnTermination({
      sessionId, profileName, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/sessions/${sessionId}/save-profile-on-termination/${encodeURIComponent(profileName)}`,
        ...args,
      });
    },
  },
};
