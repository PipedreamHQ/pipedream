import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kodagpt",
  propDefinitions: {
    question: {
      type: "string",
      label: "Question",
      description: "The question to ask the chatbot",
    },
  },
  methods: {
    _baseUrl() {
      return "https://kodagpt.com.br/api/v1";
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
          "Content-Type": "application/json",
          "API_KEY": `${this.$auth.api_key}`,
        },
      });
    },
    async semanticSearch({
      question, ...args
    }) {
      return this._makeRequest({
        path: `/embed/${this.$auth.chatbot_id}/${question}`,
        ...args,
      });
    },
  },
};
