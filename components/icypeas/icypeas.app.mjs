import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "icypeas",
  propDefinitions: {
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The Webhook URL to receive notifications. Paste this in your Icypeas profile under the API section.",
    },
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "The domain name to search for.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name to search for.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The specific email to be verified.",
    },
    searchInstanceId: {
      type: "string",
      label: "Search Instance ID",
      description: "The identifier of the specific search instance.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.icypeas.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async performSearch({
      domainName, companyName,
    }) {
      const searchType = domainName
        ? "domain-search"
        : "company-search";
      const searchParam = domainName
        ? {
          domainName,
        }
        : {
          companyName,
        };
      return this._makeRequest({
        method: "POST",
        path: `/${searchType}`,
        data: searchParam,
      });
    },
    async verifyEmail({ email }) {
      return this._makeRequest({
        method: "POST",
        path: "/email-verification",
        data: {
          email,
        },
      });
    },
    async retrieveSingleSearchResult({ searchInstanceId }) {
      return this._makeRequest({
        method: "POST",
        path: "/searches/single",
        data: {
          id: searchInstanceId,
        },
      });
    },
    async emitEvent({
      webhookUrl, data,
    }) {
      return axios({
        method: "POST",
        url: webhookUrl,
        data,
      });
    },
  },
};
