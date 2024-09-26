import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "outgrow",
  propDefinitions: {
    contentId: {
      type: "string",
      label: "Content ID",
      description: "Get the content ID from the Outgrow dashboard",
      async options() {
        const response = await this.getCalculators();
        const options = Array.isArray(response)
          ? response.map(({
            id: value, calculator: label,
          }) => ({
            label,
            value,
          }))
          : [];
        return options;
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      const builtUrl = url || `${this.getBaseUrl()}${path}`;
      return builtUrl.replace(constants.API_KEY_PLACEHOLDER, this.$auth.api_key);
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
      };
    },
    async makeRequest({
      $ = this, path, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(args.headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios($, config);
    },
    async getCalculators(args = {}) {
      return this.makeRequest({
        path: `/get_cal/${constants.API_KEY_PLACEHOLDER}`,
        ...args,
      });
    },
    async getLeads({
      contentId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/get_leads/${constants.API_KEY_PLACEHOLDER}/${contentId}`,
        ...args,
      });
    },
  },
};
