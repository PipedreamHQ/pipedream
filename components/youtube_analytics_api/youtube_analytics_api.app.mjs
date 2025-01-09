import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "youtube_analytics_api",
  propDefinitions: {
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format. The API response contains data up until the last day for which all metrics in the query are available at the time of the query. So, for example, if the request specifies an end date of July 5, 2017, and values for all of the requested metrics are only available through July 3, 2017, that will be the last date for which data is included in the response. (That is true even if data for some of the requested metrics is available for July 4, 2017.)",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format.",
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      description: "A list of YouTube Analytics dimensions, such as `video` or `ageGroup`, `gender`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the dimensions used for those reports. (The [Dimensions](https://developers.google.com/youtube/reporting#dimensions) document contains definitions for all of the dimensions.).",
      optional: true,
      options: Object.values(constants.DIMENSION),
    },
    sort: {
      type: "string[]",
      label: "Sort",
      description: "A list of dimensions or metrics that determine the sort order for YouTube Analytics data. By default the sort order is ascending. The `-` prefix causes descending sort order. Eg. `-views`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of rows to include in the response.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://youtubeanalytics.googleapis.com/v2${path}`;
    },
    getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    reportsQuery(args = {}) {
      return this._makeRequest({
        path: "/reports",
        ...args,
      });
    },
  },
};
