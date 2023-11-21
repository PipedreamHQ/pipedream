import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "webvizio",
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
        Authorization: `Bearer ${this.$auth.api_token}`,
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
        url: getUrl(path),
        headers: getHeaders(headers),
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
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
  },
};
