import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zep",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The ID of the session",
      async options({ page }) {
        const { sessions } = await this.listSessions({
          params: {
            page_number: page,
            order_by: "updated_at",
            asc: false,
          },
        });
        return sessions?.map(({ session_id }) => session_id) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ page }) {
        const { users } = await this.listUsers({
          params: {
            pageNumber: page,
          },
        });
        return users?.map(({
          user_id: value, first_name: firstName, last_name: lastName, email,
        }) => ({
          value,
          label: firstName || lastName
            ? (`${firstName} ${lastName}`).trim()
            : email || value,
        })) || [];
      },
    },
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The ID of the thread",
      async options({ page }) {
        const { threads } = await this.getThreads({
          params: {
            page_number: page,
          },
        });

        return threads?.map(({ thread_id }) => thread_id) || [];
      },
    },
    factRatingInstructions: {
      type: "object",
      label: "Fact Rating Instructions",
      description: "Instructions to use for the fact rating consisting of examples and instruction. Example: `{ \"examples\": { \"high\": \"high\", \"low\": \"low\", \"medium\": \"medium\" }, \"instruction\": \"instruction\" }`. [See the documentation](https://help.getzep.com/api-reference/memory/add-session) for more info.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "An object of key/value pairs representing the metadata associated with the session",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getzep.com/api/v2";
    },
    _makeRequest({
      $ = this,
      path,
      version,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl(version)}${path}`,
        headers: {
          "authorization": `Api-Key ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    listSessions(opts = {}) {
      return this._makeRequest({
        path: "/sessions-ordered",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users-ordered",
        ...opts,
      });
    },
    listMessages({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        path: `/sessions/${sessionId}/messages`,
        ...opts,
      });
    },
    createSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sessions",
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        ...opts,
      });
    },
    addMemoryToSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sessions/${sessionId}/memory`,
        ...opts,
      });
    },
    updateSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/sessions/${sessionId}`,
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
    listSessionMemory({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        path: `/sessions/${sessionId}/memory`,
        ...opts,
      });
    },
    getThreads(opts = {}) {
      return this._makeRequest({
        path: "/threads",
        ...opts,
      });
    },
    getThreadMessages({
      threadId, ...opts
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/messages`,
        ...opts,
      });
    },
  },
};
