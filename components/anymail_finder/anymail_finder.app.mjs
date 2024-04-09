import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "anymail_finder",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain to search the emails at.",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name to search the emails at.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.anymailfinder.com/v5.0";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...otherOpts,
      });
    },
    searchPopularEmails(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search/company.json",
        ...opts,
      });
    },
    searchPersonEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search/person.json",
        ...opts,
      });
    },
  },
};
