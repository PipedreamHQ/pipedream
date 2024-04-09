import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "diffbot",
  propDefinitions: {
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The Webhook URL to notify when the crawl finishes",
    },
    organizationNameOrUrl: {
      type: "string",
      label: "Organization Name or URL",
      description: "The name or URL of the organization to find detailed information about",
    },
    personName: {
      type: "string",
      label: "Person Name",
      description: "The name of the person to search for and return collected information",
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "The URL of the website to analyze and extract meaningful data from",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.diffbot.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitCrawlbotCompletionEvent({ webhookUrl }) {
      return this._makeRequest({
        method: "POST",
        path: "/v3/webhook",
        data: {
          eventType: "crawlbotCompletion",
          webhookUrl,
        },
      });
    },
    async findOrganization({ organizationNameOrUrl }) {
      return this._makeRequest({
        path: `/v3/organization?token=${this.$auth.oauth_access_token}&nameOrUrl=${encodeURIComponent(organizationNameOrUrl)}`,
      });
    },
    async searchPerson({ personName }) {
      return this._makeRequest({
        path: `/v3/person?token=${this.$auth.oauth_access_token}&name=${encodeURIComponent(personName)}`,
      });
    },
    async analyzeWebsite({ websiteUrl }) {
      return this._makeRequest({
        path: `/v3/analyze?token=${this.$auth.oauth_access_token}&url=${encodeURIComponent(websiteUrl)}`,
      });
    },
  },
  version: "0.0.{{ts}}",
};
