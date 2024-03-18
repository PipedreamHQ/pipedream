import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flowiseai",
  propDefinitions: {
    flowId: {
      type: "string",
      label: "Flow ID",
      description: "The unique identifier of the flow you'd like to use for computations.",
    },
    question: {
      type: "string",
      label: "Question",
      description: "User's question. E.g. `Hey, how are you?`",
    },
    history: {
      type: "object",
      label: "History",
      description: "Provide list of history messages to the flow. Only works when using [Short Term Memory](https://docs.flowiseai.com/integrations/langchain/memory/short-term-memory). E.g. `[ { \"message\": \"Hello, how can I assist you?\", \"type\": \"apiMessage\" }, { \"type\": \"userMessage\", \"message\": \"Hello I am Bob\" }, { \"type\": \"apiMessage\", \"message\": \"Hello Bob! how can I assist you?\" } ]`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.url}/api/v1`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async makePrediction({
      flowId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/prediction/${flowId}`,
        ...args,
      });
    },
  },
};
