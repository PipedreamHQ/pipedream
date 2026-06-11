import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hedy",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The unique identifier of the meeting session (e.g., `ses_0123abcd`). Use **Get Many Sessions** to list available session IDs.",
    },
    topicId: {
      type: "string",
      label: "Topic ID",
      description: "The unique identifier of the topic (e.g., `topic_5f8e9a`). Use **Get Many Topics** to list available topic IDs.",
    },
    highlightId: {
      type: "string",
      label: "Highlight ID",
      description: "The unique identifier of the highlight (e.g., `hl_20240501_abc123`). Use **Get Many Highlights** to list available highlight IDs.",
    },
    todoId: {
      type: "string",
      label: "Todo ID",
      description: "The unique identifier of the action item (todo) (e.g., `todo_987xyz`). Use **Get Many Todos** to list available todo IDs.",
    },
    contextId: {
      type: "string",
      label: "Context ID",
      description: "The unique identifier of the session context (e.g., `ctx_456def`). Use **Get Many Session Contexts** to list available context IDs.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of items to return (1–100). Defaults to 20. Example: `50`.",
      min: 1,
      max: 100,
      optional: true,
      default: 20,
    },
    after: {
      type: "string",
      label: "After Cursor",
      description: "Pagination cursor from a previous response's `pagination.after` field. Pass this value to retrieve the next page of results (e.g., `eyJpZCI6IjEyMyJ9`).",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The context name (maximum 200 characters).",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Custom AI instruction text for this context (maximum 20,000 characters). Describe how Hedy should analyze meetings — e.g., focus areas, summary style, or specific data to extract.",
      optional: true,
    },
    isDefault: {
      type: "boolean",
      label: "Set as Default",
      description: "Set to `true` to make this the default context automatically applied to new sessions.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hedy.bot";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, method = "GET", path, params, data,
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params,
        data,
      });
    },
    listSessions({
      $ = this, params,
    }) {
      return this._makeRequest({
        $,
        path: "/sessions",
        params,
      });
    },
    getSession({
      $ = this, sessionId,
    }) {
      return this._makeRequest({
        $,
        path: `/sessions/${sessionId}`,
      });
    },
    listHighlights({
      $ = this, params,
    }) {
      return this._makeRequest({
        $,
        path: "/highlights",
        params,
      });
    },
    getHighlightsBySession({
      $ = this, sessionId, params,
    }) {
      return this._makeRequest({
        $,
        path: `/sessions/${sessionId}/highlights`,
        params,
      });
    },
    getHighlight({
      $ = this, highlightId,
    }) {
      return this._makeRequest({
        $,
        path: `/highlights/${highlightId}`,
      });
    },
    listTodos({
      $ = this, params,
    }) {
      return this._makeRequest({
        $,
        path: "/todos",
        params,
      });
    },
    getTodosBySession({
      $ = this, sessionId, params,
    }) {
      return this._makeRequest({
        $,
        path: `/sessions/${sessionId}/todos`,
        params,
      });
    },
    getTodo({
      $ = this, sessionId, todoId,
    }) {
      return this._makeRequest({
        $,
        path: `/sessions/${sessionId}/todos/${todoId}`,
      });
    },
    listTopics({ $ = this }) {
      return this._makeRequest({
        $,
        path: "/topics",
      });
    },
    getTopic({
      $ = this, topicId,
    }) {
      return this._makeRequest({
        $,
        path: `/topics/${topicId}`,
      });
    },
    getTopicSessions({
      $ = this, topicId, params,
    }) {
      return this._makeRequest({
        $,
        path: `/topics/${topicId}/sessions`,
        params,
      });
    },
    createTopic({
      $ = this, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/topics",
        data,
      });
    },
    updateTopic({
      $ = this, topicId, data,
    }) {
      return this._makeRequest({
        $,
        method: "PATCH",
        path: `/topics/${topicId}`,
        data,
      });
    },
    deleteTopic({
      $ = this, topicId,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/topics/${topicId}`,
      });
    },
    listContexts({ $ = this }) {
      return this._makeRequest({
        $,
        path: "/contexts",
      });
    },
    getContext({
      $ = this, contextId,
    }) {
      return this._makeRequest({
        $,
        path: `/contexts/${contextId}`,
      });
    },
    createContext({
      $ = this, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/contexts",
        data,
      });
    },
    updateContext({
      $ = this, contextId, data,
    }) {
      return this._makeRequest({
        $,
        method: "PATCH",
        path: `/contexts/${contextId}`,
        data,
      });
    },
    deleteContext({
      $ = this, contextId,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/contexts/${contextId}`,
      });
    },
  },
};
