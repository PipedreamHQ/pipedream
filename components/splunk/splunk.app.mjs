import { axios } from "@pipedream/platform";
import https from "https";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "splunk",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Search ID",
      description: "The ID of the Splunk search job to retrieve status for",
      async options({ page }) {
        const { entry } = await this.listJobs({
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
      async options({ page }) {
        const { entry } = await this.listIndexes({
          params: {
            count: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        return entry?.map(({ name }) => name) || [];
      },
    },
    savedSearchName: {
      type: "string",
      label: "Saved Search Name",
      description: "The name of a saved search",
      async options({ page }) {
        const { entry } = await this.listSavedSearches({
          params: {
            count: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        return entry?.map(({ name }) => name) || [];
      },
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "The Splunk search query. Example: `search *`. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/SearchReference/Search) for more information about search command sytax.",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}:${this.$auth.api_port}/services`;
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      const config = {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        params: {
          ...params,
          output_mode: "json",
        },
      };
      if (this.$auth.self_signed) {
        config.httpsAgent = new https.Agent({
          rejectUnauthorized: false,
        });
      }
      return axios($, config);
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/search/jobs",
        ...opts,
      });
    },
    listIndexes(opts = {}) {
      return this._makeRequest({
        path: "/data/indexes",
        ...opts,
      });
    },
    listSavedSearches(opts = {}) {
      return this._makeRequest({
        path: "/saved/searches",
        ...opts,
      });
    },
    listFiredAlerts(opts = {}) {
      return this._makeRequest({
        path: "/alerts/fired_alerts",
        ...opts,
      });
    },
    updateSavedSearch({
      name, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/saved/searches/${name}`,
        ...opts,
      });
    },
    getSavedSearch({
      name, ...opts
    }) {
      return this._makeRequest({
        path: `/saved/searches/${name}`,
        ...opts,
      });
    },
    executeSearchQuery({
      name, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/saved/searches/${name}/dispatch`,
        ...opts,
      });
    },
    getSearchJobStatus({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/search/jobs/${jobId}`,
        ...opts,
      });
    },
    getSearchResults({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/search/v2/jobs/${jobId}/results`,
        ...opts,
      });
    },
    getSearchEvents({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/search/v2/jobs/${jobId}/events`,
        ...opts,
      });
    },
    sendEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/receivers/simple",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          count: DEFAULT_LIMIT,
        },
      };
      let hasMore, count = 0;
      do {
        const {
          entry, paging,
        } = await resourceFn(args);
        for (const item of entry) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        hasMore = paging.total > count;
        args.params.offset += args.params.count;
      } while (hasMore);
    },
  },
};
