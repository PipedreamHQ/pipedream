import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "project_broadcast",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact.",
      async options({ page }) {
        const { contacts } = await this.searchContacts({
          data: {
            paging: {
              page: page + 1,
            },
          },
        });
        return contacts.map(({
          _id: value, firstName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    keywordId: {
      type: "string",
      label: "Keyword ID",
      description: "The ID of the keyword.",
      async options({ page }) {
        const { keywords } = await this.searchKeywords({
          data: {
            paging: {
              page: page + 1,
            },
          },
        });
        return keywords.map(({
          _id: value, word: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    prepareSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export("$summary", msg);
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
    async makeRequest({
      step = this, path, headers, summary, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };

      const response = await axios(step, config);

      if (typeof summary === "function") {
        this.prepareSummary(step)(summary(response));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    searchContacts(args = {}) {
      return this.post({
        path: "/contacts/search",
        ...args,
      });
    },
    searchKeywords(args = {}) {
      return this.post({
        path: "/keywords/search",
        ...args,
      });
    },
  },
};
