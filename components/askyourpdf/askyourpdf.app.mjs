import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "askyourpdf",
  methods: {
    exportSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export(constants.SUMMARY_LABEL, msg);
    },
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
        ...headers,
      };
    },
    getConfig({
      headers, data: preData, ...args
    } = {}) {
      const contentType = constants.CONTENT_TYPE_KEY_HEADER;
      const hasMultipartHeader = utils.hasMultipartHeader(headers);
      const data = hasMultipartHeader && utils.getFormData(preData) || preData;
      const currentHeaders = this.getHeaders(headers);

      return {
        headers: hasMultipartHeader
          ? {
            ...currentHeaders,
            [contentType]: data.getHeaders()[contentType.toLowerCase()],
          }
          : currentHeaders,
        data,
        ...args,
      };
    },
    async makeRequest({
      step = this, path, headers, data, summary, ...args
    } = {}) {
      const config = this.getConfig({
        url: this.getUrl(path),
        headers,
        data,
        ...args,
      });

      const response = await axios(step, config);

      if (typeof summary === "function") {
        this.exportSummary(step)(summary(response));
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
