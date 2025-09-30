import common from "../common/reports-query.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "youtube_analytics_api-list-channel-reports",
  name: "List Channel Reports",
  description:
    "Fetch summary analytics reports for a specified youtube channel. Optional filters include date range and report type. [See the documentation](https://developers.google.com/youtube/analytics/reference/reports/query)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  additionalProps() {
    const {
      getIdsProps, getReportTypeProps,
    } = this;

    return {
      ...getIdsProps(),
      ...getReportTypeProps(),
    };
  },
  methods: {
    ...common.methods,
    getReportTypeProps() {
      const { channelReportType } = this;
      const {
        VIDEO_BASIC_USER_ACTIVITY_STATS, PLAYLIST_BASIC_STATS,
      } =
        constants.CHANNEL_REPORT_TYPE;

      if (channelReportType === VIDEO_BASIC_USER_ACTIVITY_STATS.value) {
        const supportedFilters =
          VIDEO_BASIC_USER_ACTIVITY_STATS.metadata.filters.reduce(
            (acc, filter) => ({
              ...acc,
              [filter]: "",
            }),
            {},
          );

        return {
          channelReportType: propsFragments.channelReportType,
          metrics: {
            ...propsFragments.metrics,
            options: VIDEO_BASIC_USER_ACTIVITY_STATS.metadata.metrics,
          },
          filters: {
            ...propsFragments.filters,
            description: `**Supported filters: \`${JSON.stringify(supportedFilters)}\`**. ${propsFragments.filters.description}`,
          },
        };
      }

      if (channelReportType === PLAYLIST_BASIC_STATS.value) {
        const supportedFilters = PLAYLIST_BASIC_STATS.metadata.filters.reduce(
          (acc, filter) => ({
            ...acc,
            [filter]: "",
          }),
          {},
        );

        return {
          channelReportType: propsFragments.channelReportType,
          metrics: {
            ...propsFragments.metrics,
            options: PLAYLIST_BASIC_STATS.metadata.metrics,
          },
          filters: {
            ...propsFragments.filters,
            description: `**Supported filters: \`${JSON.stringify(supportedFilters)}\`**. ${propsFragments.filters.description}`,
          },
        };
      }

      return {
        channelReportType: propsFragments.channelReportType,
      };
    },
  },
  async run({ $ }) {
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
