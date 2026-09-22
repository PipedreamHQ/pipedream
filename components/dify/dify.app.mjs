// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

const BASE_URL = "https://api.dify.ai/v1";

export default {
  type: "app",
  app: "dify",
  propDefinitions: {
    user: {
      type: "string",
      label: "User",
      description: "A unique identifier for the end user, defined by you (e.g. an internal user ID or session ID) — not a Dify account. Dify scopes conversations, messages, and files to this value, so reuse the same `User` across requests for the same end user. When reading conversations or messages, this must match the `User` value used when they were created — Dify returns an empty page, not an error, for a mismatched value. For **List Conversations** and **List Messages**, Dify has no endpoint to list end users: use the `User` value from the user's request, or ask for it. [See the documentation](https://docs.dify.ai/en/api-reference/guides/end-user-identity)",
    },
    inputs: {
      type: "object",
      label: "Inputs",
      description: "Values for the app's input variables, keyed by variable name, e.g. `{ \"city\": \"San Francisco\" }`. Leave empty (`{}`) if the app defines no input variables — most chat apps don't. Use **Get App Parameters** to discover this app's actual variable names and whether each is required.",
      optional: true,
    },
  },
  methods: {
    _headers(headers) {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        url: `${BASE_URL}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    runWorkflow(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/workflows/run",
        ...args,
      });
    },
    listWorkflowLogs(args = {}) {
      return this._makeRequest({
        path: "/workflows/logs",
        ...args,
      });
    },
    listConversations(args = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...args,
      });
    },
    listMessages(args = {}) {
      return this._makeRequest({
        path: "/messages",
        ...args,
      });
    },
    getAppParameters(args = {}) {
      return this._makeRequest({
        path: "/parameters",
        ...args,
      });
    },
  },
};
