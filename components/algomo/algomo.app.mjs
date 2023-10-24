import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "algomo",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Chatbot ID",
      description: "The identifier for the chatbot",
    },
    messageText: {
      type: "string",
      label: "Message Text",
      description: "The message that you wish to generate a response for",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "A user-defined identifier for threading conversations. This allows the bot to refer to previous messages when responding, providing more contextually relevant answers. If conversationId isn't provided, one will be generated for you",
      optional: true,
    },
  },
  methods: {
    exportSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export(constants.SUMMARY_LABEL, msg);
    },
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
      };
    },
    async makeRequest({
      step = this, path, headers, summary, ...args
    } = {}) {
      const {
        getUrl,
        getHeaders,
        exportSummary,
      } = this;

      const config = {
        ...args,
        url: getUrl(path),
        headers: getHeaders(headers),
      };

      const response = await axios(step, config);

      if (typeof summary === "function") {
        exportSummary(step)(summary(response));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
