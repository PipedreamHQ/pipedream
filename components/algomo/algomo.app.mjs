import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "algomo",
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
    getData(data) {
      return {
        botId: this.$auth.chatbot_id,
        ...data,
      };
    },
    async makeRequest({
      step = this, path, headers, summary, data, ...args
    } = {}) {
      const {
        getUrl,
        getHeaders,
        exportSummary,
        getData,
      } = this;

      const config = {
        url: getUrl(path),
        headers: getHeaders(headers),
        data: getData(data),
        ...args,
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
