import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sessions",
  version: "0.0.{{ts}}",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The unique identifier for a session.",
      async options({ prevContext }) {
        const { page = 0 } = prevContext;
        const {
          data, headers,
        } = await this.listSessions({
          params: {
            page,
          },
        });
        const options = data.map((session) => ({
          label: session.name,
          value: session.id,
        }));
        const nextPage = headers["x-next-page"]
          ? parseInt(headers["x-next-page"], 10)
          : null;
        return {
          options,
          context: nextPage
            ? {
              page: nextPage,
            }
            : undefined,
        };
      },
    },
    endedAt: {
      type: "string",
      label: "Ended At",
      description: "The timestamp when the session ended (in ISO 8601 format).",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.app.sessions.us";
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
    async listSessions(opts = {}) {
      return this._makeRequest({
        path: "/api/sessions",
        ...opts,
      });
    },
    async getSession({ sessionId }) {
      return this._makeRequest({
        path: `/api/sessions/${sessionId}`,
      });
    },
    async paginate(fn, ...opts) {
      const results = [];
      let hasMore = true;
      let page = 0;
      while (hasMore) {
        const {
          data, headers,
        } = await fn({
          ...opts,
          params: {
            page,
          },
        });
        results.push(...data);
        hasMore = headers["x-next-page"]
          ? true
          : false;
        page++;
      }
      return results;
    },
    async getSessionsStarted({ endedAt }) {
      const sessions = await this.paginate(this.listSessions);
      return sessions.filter((session) => session.endedAt === null && new Date(session.startAt) <= new Date(endedAt));
    },
    async getSessionsEnded({ endedAt }) {
      const sessions = await this.paginate(this.listSessions);
      return sessions.filter((session) => new Date(session.endedAt) <= new Date(endedAt));
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
