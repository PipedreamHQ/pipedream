import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import { parseStringPromise } from "xml2js";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "vitel_phone",
  methods: {
    exportSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export(constants.SUMMARY_LABEL, msg);
    },
    getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    getParams(params) {
      const {
        username,
        password,
      } = this.$auth;
      return {
        username,
        password,
        ...params,
      };
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
      };
    },
    async parseResponse(response) {
      try {
        return await parseStringPromise(`<data>${response}</data>`);
      } catch (error) {
        console.error("Response", response);
      }
      return {
        data: {
          error: `Error parsing response: ${response}`,
        },
      };
    },
    async makeRequest({
      step = this, path, headers, params, summary, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        params: this.getParams(params),
        transformResponse: this.parseResponse,
        ...args,
      };

      const { data: response } = await axios(step, config);

      if (typeof summary === "function") {
        this.exportSummary(step)(summary(response));
      }

      return response;
    },
  },
};
