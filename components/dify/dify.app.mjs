// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dify",
  propDefinitions: {
    user: {
      type: "string",
      label: "User",
      description: "A unique identifier for the end user, defined by you (e.g. an internal user ID or session ID) — not a Dify account. Dify scopes conversations, messages, and files to this value, so reuse the same `User` across requests for the same end user. [See the documentation](https://docs.dify.ai/en/api-reference/guides/end-user-identity)",
    },
    inputs: {
      type: "object",
      label: "Inputs",
      description: "Values for the app's input variables, keyed by variable name, e.g. `{ \"city\": \"San Francisco\" }`. Leave empty (`{}`) if the app defines no input variables — most chat apps don't. The variable names and types are specific to how this particular Dify app was built, so if you don't already know them, ask the user which input variables their app expects rather than guessing; they can also be found on the app's **Orchestrate**/**Configure** tab in the Dify console.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dify.ai/v1";
    },
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
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    sendChatMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat-messages",
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
    listConversations(args = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...args,
      });
    },
    listDatasets(args = {}) {
      return this._makeRequest({
        path: "/datasets",
        ...args,
      });
    },
    retrieveFromDataset({
      datasetId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/datasets/${datasetId}/retrieve`,
        ...args,
      });
    },
  },
};
