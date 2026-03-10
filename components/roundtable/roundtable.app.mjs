import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "roundtable",
  propDefinitions: {
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The question or topic for the AI council to discuss",
    },
    thinkingLevel: {
      type: "string",
      label: "Thinking Level",
      description: "How deeply models should think",
      options: ["low", "medium", "high"],
      default: "medium",
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Discussion mode",
      options: ["brainstorming", "debating", "analyzing", "solving"],
      default: "brainstorming",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return "https://mcp.roundtable.now/api/v1";
    },
    getHeaders() {
      return {
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
      };
    },
    async makeRequest({ $ = this, path, ...opts }) {
      return axios($, {
        url: `${this.getBaseUrl()}${path}`,
        headers: this.getHeaders(),
        ...opts,
      });
    },
    async consult({ $, ...opts }) {
      return this.makeRequest({ $, path: "/consult", method: "POST", ...opts });
    },
    async architect({ $, ...opts }) {
      return this.makeRequest({ $, path: "/architect", method: "POST", ...opts });
    },
    async reviewCode({ $, ...opts }) {
      return this.makeRequest({ $, path: "/review-code", method: "POST", ...opts });
    },
    async debug({ $, ...opts }) {
      return this.makeRequest({ $, path: "/debug", method: "POST", ...opts });
    },
    async planImplementation({ $, ...opts }) {
      return this.makeRequest({ $, path: "/plan-implementation", method: "POST", ...opts });
    },
    async assessTradeoffs({ $, ...opts }) {
      return this.makeRequest({ $, path: "/assess-tradeoffs", method: "POST", ...opts });
    },
    async listSessions({ $, ...opts }) {
      return this.makeRequest({ $, path: "/sessions", method: "GET", ...opts });
    },
    async getSession({ $, sessionId, ...opts }) {
      return this.makeRequest({ $, path: `/sessions/${sessionId}`, method: "GET", ...opts });
    },
  },
};
