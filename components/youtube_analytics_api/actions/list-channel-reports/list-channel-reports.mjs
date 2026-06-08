import { ConfigurationError } from "@pipedream/platform";
import common from "../common/reports-query.mjs";
import utils from "../../common/utils.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "youtube_analytics_api-list-channel-reports",
  name: "List Channel Reports",
  description:
    "Fetch summary analytics reports for a specified youtube channel. Optional filters include date range and report type. [See the documentation](https://developers.google.com/youtube/analytics/reference/reports/query)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    channelReportType: propsFragments.channelReportType,
    metrics: propsFragments.metrics,
    filters: propsFragments.filters,
  },
  methods: {
    ...common.methods,
    getReportTypeMetadata() {
      return utils.findChannelReportType(this.channelReportType)?.metadata;
    },
    validateMetrics() {
      const metadata = this.getReportTypeMetadata();
      if (!metadata || !this.metrics?.length) {
        return;
      }

      const invalid = this.metrics.filter(
        (metric) => !metadata.metrics.includes(metric),
      );
      if (invalid.length) {
        throw new ConfigurationError(
          `Invalid metric(s) for **${this.channelReportType}**: ${invalid.join(", ")}. Supported metrics: ${metadata.metrics.join(", ")}.`,
        );
      }
    },
    validateFilters() {
      const metadata = this.getReportTypeMetadata();
      if (!metadata) {
        return;
      }

      const filtersObj = utils.parseJson(this.filters);
      if (!filtersObj) {
        return;
      }

      const invalid = Object.keys(filtersObj).filter(
        (key) => !metadata.filters.includes(key),
      );
      if (invalid.length) {
        throw new ConfigurationError(
          `Invalid filter key(s) for **${this.channelReportType}**: ${invalid.join(", ")}. Supported filters: ${metadata.filters.join(", ")}.`,
        );
      }
    },
    validateConfiguration() {
      this.validateIds();
      this.validateMetrics();
      this.validateFilters();
    },
  },
  async run({ $ }) {
    this.validateConfiguration();

    const {
      app,
      getIdsParam,
      getFiltersParam,
      startDate,
      endDate,
      metrics,
      sort,
      maxResults,
    } = this;

    const response = await app.reportsQuery({
      $,
      params: {
        ids: getIdsParam(),
        startDate,
        endDate,
        metrics: utils.arrayToCommaSeparatedList(metrics),
        filters: getFiltersParam(),
        sort: utils.arrayToCommaSeparatedList(sort),
        maxResults,
      },
    });

    $.export("$summary", "Successfully fetched channel reports.");
    return response;
  },
};
