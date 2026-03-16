import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "perplexity",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The name of the model that will complete your prompt",
      options: constants.MODELS,
    },
    content: {
      type: "string",
      label: "Content",
      description: "The contents of the message in this turn of conversation",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the speaker in this turn of conversation. After the (optional) system message, user and assistant roles should alternate with 'user' then 'assistant', ending in 'user'.",
      options: constants.ROLES,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query string. Can also be a JSON array of query strings for multi-query search.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of search results to return",
      optional: true,
    },
    maxTokensPerPage: {
      type: "integer",
      label: "Max Tokens Per Page",
      description: "Maximum number of tokens per page in the results",
      optional: true,
    },
    maxTokensTotal: {
      type: "integer",
      label: "Max Tokens",
      description: "Maximum total tokens across all results",
      optional: true,
    },
    searchDomainFilter: {
      type: "string[]",
      label: "Search Domain Filter",
      description: "List of domains to allowlist or denylist (prefix with `-` to exclude). Do not mix allowlist and denylist entries.",
      optional: true,
    },
    searchLanguageFilter: {
      type: "string[]",
      label: "Search Language Filter",
      description: "List of ISO 639-1 language codes to filter results (max 10)",
      optional: true,
    },
    searchRecencyFilter: {
      type: "string",
      label: "Search Recency Filter",
      description: "Filter results by recency",
      options: constants.RECENCY_FILTERS,
      optional: true,
    },
    searchContextSize: {
      type: "string",
      label: "Search Context Size",
      description: "The size of the search context",
      options: [
        "low",
        "medium",
        "high",
      ],
      optional: true,
    },
    searchMode: {
      type: "string",
      label: "Search Mode",
      description: "The search mode to use",
      options: [
        "academic",
        "sec",
      ],
      optional: true,
    },
    input: {
      type: "string",
      label: "Input",
      description: "The input text for the Agent API",
    },
    preset: {
      type: "string",
      label: "Preset",
      description: "A predefined agent preset to use. Either preset or model must be provided.",
      options: constants.AGENT_PRESETS,
      optional: true,
    },
    agentModel: {
      type: "string",
      label: "Model",
      description: "The model to use for the agent response. Supports third-party models like `openai/gpt-5.1`. Either preset or model must be provided.",
      optional: true,
    },
    tools: {
      type: "string[]",
      label: "Tools",
      description: "Array of tool objects as JSON strings. Each tool object defines a tool the agent can use.",
      optional: true,
    },
    embeddingsModel: {
      type: "string",
      label: "Model",
      description: "The embedding model to use",
      options: constants.EMBEDDING_MODELS,
    },
    embeddingsInput: {
      type: "string[]",
      label: "Input",
      description: "Array of text strings to generate embeddings for",
    },
    contextualizedEmbeddingsModel: {
      type: "string",
      label: "Model",
      description: "The contextualized embedding model to use",
      options: constants.CONTEXTUALIZED_EMBEDDING_MODELS,
    },
    contextualizedEmbeddingsInput: {
      type: "string[]",
      label: "Input",
      description: "Array of JSON-stringified arrays. Each inner array is a group of text strings representing a document and its context.",
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Sampling temperature. Higher values produce more diverse output.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top-p",
      description: "Nucleus sampling probability mass. Use either temperature or top_p.",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "Enable server-side streaming",
      optional: true,
    },
    messages: {
      type: "string[]",
      label: "Messages",
      description: "Array of message objects as JSON strings, each with `role` and `content` properties",
    },
    maxCompletionTokens: {
      type: "integer",
      label: "Max Completion Tokens",
      description: "Maximum number of tokens in the completion",
      optional: true,
    },
    enableSearchClassifier: {
      type: "boolean",
      label: "Enable Search Classifier",
      description: "Enable the search classifier",
      optional: true,
    },
    disableSearch: {
      type: "boolean",
      label: "Disable Search",
      description: "Disable web search for this request",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.perplexity.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async chatCompletions(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/chat/completions",
        ...args,
      });
    },
    async search(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/search",
        ...args,
      });
    },
    async createResponse(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/v1/responses",
        ...args,
      });
    },
    async createEmbeddings(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/v1/embeddings",
        ...args,
      });
    },
    async createContextualizedEmbeddings(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/v1/contextualizedembeddings",
        ...args,
      });
    },
  },
};
