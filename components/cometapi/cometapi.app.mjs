import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cometapi",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The model ID to use for the request. Choose from GPT, Claude, Gemini, Grok, DeepSeek, Qwen, and other available models. Different models have different capabilities and costs.",
      async options() {
        const response = await this.listModels();

        // Safely access the models array from API response
        const models = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.models)
            ? response.data.models
            : response.data;

        if (!Array.isArray(models)) {
          throw new Error("Unexpected models response format");
        }

        return models.map(({ id }) => ({
          label: id,
          value: id,
        }));
      },
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Maximum number of tokens to generate in the completion. Limits response length and controls costs. Typical values: 100-500 for short responses, 1000-2000 for detailed answers, 4000+ for long content.",
      min: 1,
      optional: true,
      default: 1000,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Controls randomness in the response. Range: [0.0, 2.0]. Lower values (0.1-0.3) are more focused and deterministic, good for factual tasks. Higher values (0.7-1.0) are more creative and varied, good for brainstorming. Very high values (1.5-2.0) produce more random outputs.",
      optional: true,
      default: "0.7",
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "Controls diversity via nucleus sampling. Range: [0.0, 1.0]. Only considers tokens with cumulative probability up to this value. 0.1 = very focused, 0.5 = balanced, 0.9 = diverse. Alternative to temperature for controlling randomness.",
      optional: true,
      default: "1",
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "Controls diversity by limiting the number of highest probability tokens to consider. Range: [1, ∞). Typical values: 10-100.",
      min: 1,
      optional: true,
      default: 50,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Reduces repetition by penalizing tokens based on their frequency in the text. Range: [-2.0, 2.0]. Positive values discourage repetition, negative values encourage it. 0 = no penalty.",
      optional: true,
      default: "0",
    },
    presencePenalty: {
      type: "string",
      label: "Presence Penalty",
      description: "Reduces repetition by penalizing tokens that have already appeared. Range: [-2.0, 2.0]. Positive values encourage new topics, negative values focus on existing topics. 0 = no penalty.",
      optional: true,
      default: "0",
    },
    repetitionPenalty: {
      type: "string",
      label: "Repetition Penalty",
      description: "Controls how much the model should avoid repeating tokens. Range: [0.0, 2.0]. Values > 1.0 discourage repetition.",
      optional: true,
      default: "1",
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Seed for deterministic outputs. If specified, the system will make a best effort to sample deterministically.",
      optional: true,
    },
    stop: {
      type: "string[]",
      label: "Stop",
      description: "Up to 4 sequences where the API will stop generating further tokens.",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "Whether to stream partial message deltas.",
      optional: true,
      default: false,
    },
  },
  methods: {
    /**
     * Get the base API URL for CometAPI
     * @returns {string} The base API URL
     */
    _apiUrl() {
      return "https://api.cometapi.com";
    },

    /**
     * Get the headers for API requests including authentication
     * @returns {Object} Headers object with Authorization and Content-Type
     */
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },

    /**
     * Make an HTTP request to the CometAPI
     * @param {Object} options - Request options
     * @param {Object} options.$ - Pipedream context for logging
     * @param {string} options.path - API endpoint path
     * @param {Object} options.args - Additional axios options
     * @returns {Promise<Object>} API response
     */
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: this._apiUrl() + path,
        headers: this._getHeaders(),
        timeout: 300000, // 5 minutes default timeout
        ...args,
      }).catch((error) => {
        // Enhanced error handling for common API issues
        if (error.response) {
          const {
            status, data,
          } = error.response;
          if (status === 401) {
            throw new Error("[401] Authentication failed. Please check your CometAPI key.");
          }
          if (status === 429) {
            throw new Error("[429] Rate limit exceeded. Please wait before making another request.");
          }
          if (status === 400 && data?.error?.message) {
            throw new Error(`[400] CometAPI Error: ${data.error.message}`);
          }
        }
        throw error;
      });
    },

    /**
     * List all available models from CometAPI with pagination handling
     * @param {Object} args - Request arguments
     * @returns {Promise<Object>} Response containing array of available models
     */
    async listModels(args = {}) {
      // Note: CometAPI models endpoint returns all models in a single response
      // No pagination is needed as per API documentation
      return this._makeRequest({
        path: "/v1/models",
        ...args,
      });
    },

    /**
     * Send a chat completion request to CometAPI
     * @param {Object} options - Request options
     * @param {Object} options.$ - Pipedream context
     * @param {Object} options.args - Request body and additional options
     * @returns {Promise<Object>} Chat completion response
     */
    async sendChatCompletionRequest({
      $, ...args
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/v1/chat/completions",
        ...args,
      });
    },

    /**
     * Send a text completion request to CometAPI
     * @param {Object} options - Request options
     * @param {Object} options.$ - Pipedream context
     * @param {Object} options.args - Request body and additional options
     * @returns {Promise<Object>} Text completion response
     */
    async sendCompletionRequest({
      $, ...args
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/v1/completions",
        ...args,
      });
    },
  },
};
