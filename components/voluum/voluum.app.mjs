import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "voluum",
  propDefinitions: {
    columns: {
      type: "string[]",
      label: "Columns",
      description: "A list of columns",
      async options() {
        const { columnMappings } = await this.getColumnInfo();
        return columnMappings.map(({
          key: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sharedReportId: {
      type: "string",
      label: "Shared Report ID",
      description: "The ID of the shared report to retrieve.",
      async options() {
        const { sharedReports } = await this.listSharedReports();
        return sharedReports.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.voluum.com";
    },
    _headers() {
      return {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json",
        "cwauth-token": this.$auth.oauth_access_token,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    reportData(opts = {}) {
      return this._makeRequest({
        path: "/report",
        ...opts,
      });
    },
    getColumnInfo() {
      return this._makeRequest({
        path: "/column/info",
      });
    },
    listSharedReports(opts = {}) {
      return this._makeRequest({
        path: "/shared-report",
        ...opts,
      });
    },
    listEventLogs(opts = {}) {
      return this._makeRequest({
        path: "/event-log",
        ...opts,
      });
    },
    getSharedReport({
      sharedReportId, ...opts
    }) {
      return this._makeRequest({
        path: `/shared-report/${sharedReportId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, itemsField, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page++;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data[itemsField]) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data[itemsField].length === LIMIT;

      } while (hasMore);
    },
  },
};

