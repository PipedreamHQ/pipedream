import { axios } from "@pipedream/platform";
import https from "https";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "splunk",
  propDefinitions: {
    searchId: {
      type: "string",
      label: "Search ID",
      description: "The ID of the Splunk search job to retrieve status for",
      async options({
        selfSigned, page,
      }) {
        const { entry } = await this.listSearches({
          selfSigned,
          params: {
            count: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        return entry?.map(({
          name: label, content,
        }) => ({
          label,
          value: content.sid,
        })) || [];
      },
    },
    indexName: {
      type: "string",
      label: "Index Name",
      description: "The name of the Splunk index",
      async options({
        selfSigned, page,
      }) {
        const { entry } = await this.listIndexes({
          selfSigned,
          params: {
            count: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        return entry?.map(({ name }) => name) || [];
      },
    },
    selfSigned: {
      type: "boolean",
      label: "Self Signed",
      description: "Set to `true` if your instance is using a self-signed certificate",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}:${this.$auth.api_port}`;
    },
    _makeRequest({
      $ = this,
      path,
      params,
      selfSigned = false,
      ...otherOpts
    }) {
      const config = {
        ...otherOpts,
        debug: true,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        params: {
          ...params,
          output_mode: "json",
        },
      };
      if (selfSigned) {
        config.httpsAgent = new https.Agent({
          rejectUnauthorized: false,
        });
      }
      return axios($, config);
    },
    listSearches(opts = {}) {
      return this._makeRequest({
        path: "/services/search/jobs",
        ...opts,
      });
    },
    listIndexes(opts = {}) {
      return this._makeRequest({
        path: "/services/data/indexes",
        ...opts,
      });
    },
    executeSearchQuery(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/services/search/jobs",
        ...opts,
      });
    },
    getSearchJobStatus({
      searchId, ...opts
    }) {
      return this._makeRequest({
        path: `/services/search/jobs/${searchId}`,
        ...opts,
      });
    },
    sendEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/services/receivers/simple",
        ...opts,
      });
    },
  },
};
