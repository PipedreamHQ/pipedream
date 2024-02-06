import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "h_supertools_analytics_tool",
  propDefinitions: {
    from: {
      type: "string",
      label: "From",
      description: "The starting date in `Y-m-d` format.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the statistic.",
      options: [
        "browser",
        "campaign",
        "city",
        "continent",
        "country",
        "device",
        "event",
        "landing_page",
        "language",
        "os",
        "page",
        "pageviews",
        "pageviews_hours",
        "referrer",
        "resolution",
        "visitors",
        "visitors_hours",
      ],
    },
    reportId: {
      type: "integer",
      label: "Report Id",
      description: "The id of the report you want to retrieve.",
      async options({ page }) {
        const { data } = await this.listReports({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, domain: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    to: {
      type: "string",
      label: "To",
      description: "The ending date in `Y-m-d` format.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://analytics.h-supertools.com/api/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createReport(args = {}) {
      return this._makeRequest({
        path: "websites",
        method: "POST",
        ...args,
      });
    },
    listReports(args = {}) {
      return this._makeRequest({
        path: "websites",
        ...args,
      });
    },
    retrieveReportData({
      reportId, ...args
    }) {
      return this._makeRequest({
        path: `stats/${reportId}`,
        ...args,
      });
    },
    async *paginate({
      fn, reportId, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          current_page,
          last_page,
        } = await fn({
          reportId,
          params,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = (current_page != last_page);

      } while (lastPage);
    },
  },
};
