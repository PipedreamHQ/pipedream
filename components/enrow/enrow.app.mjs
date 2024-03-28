import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "enrow",
  propDefinitions: {
    searchId: {
      type: "string",
      label: "Search ID",
      description: "The identifier for the specific search.",
    },
    name: {
      type: "string",
      label: "Full Name",
      description: "The full name of the person you're searching for.",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the email you want to find.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.enrow.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getResult(searchId) {
      return this._makeRequest({
        path: `/emailFinder/${searchId}`,
      });
    },
    async executeSearch(name, domain) {
      return this._makeRequest({
        method: "POST",
        path: "/emailFinder",
        data: {
          name,
          domain,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
