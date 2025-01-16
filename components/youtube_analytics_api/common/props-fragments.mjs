import constants from "./constants.mjs";

export default {
  idType: {
    type: "string",
    label: "ID Type",
    description: "The type of ID to use for the query. This can be either `My Channel`, `Channel ID`, or `Content Owner`.",
    options: Object.values(constants.ID_TYPE),
    default: constants.ID_TYPE.CHANNEL.value,
    reloadProps: true,
  },
  channelReportType: {
    type: "string",
    label: "Channel Report Type",
    description: "The type of report to fetch for the specified YouTube Channel. This selects default dimensions, metrics and filters.",
    options: Object.values(constants.CHANNEL_REPORT_TYPE)
      .map(({
        // eslint-disable-next-line no-unused-vars
        metadata,
        ...rest
      }) => rest),
    default: constants.CHANNEL_REPORT_TYPE.VIDEO_BASIC_USER_ACTIVITY_STATS.value,
    reloadProps: true,
  },
  metrics: {
    type: "string[]",
    label: "Metrics",
    description: "Metrics, such as `views` or `likes`, `dislikes`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the metrics available in each report. (The [Metrics](https://developers.google.com/youtube/reporting#metrics) document contains definitions for all of the metrics.).",
    options: Object.values(constants.METRIC),
  },
  filters: {
    type: "object",
    label: "Filters",
    description: "A list of filters that should be applied when retrieving YouTube Analytics data. The documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) and [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) identifies the dimensions that can be used to filter each report, and the [Dimensions](https://developers.google.com/youtube/analytics/dimsmets/dims) document defines those dimensions.\n\nIf a request uses multiple filters the returned result table will satisfy both filters. For example, a filters parameter value of `{\"video\":\"dMH0bHeiRNg\",\"country\":\"IT\"}` restricts the result set to include data for the given video in Italy.\n\nSpecifying multiple values for a filter\nThe API supports the ability to specify multiple values for the [video](https://developers.google.com/youtube/reporting#supported-reports), [playlist](https://developers.google.com/youtube/reporting#supported-reports), and [channel](https://developers.google.com/youtube/reporting#supported-reports) filters. To do so, specify a separated list of the video, playlist, or channel IDs for which the API response should be filtered. For example, a filters parameter value of `{\"video\":\"pd1FJh59zxQ,Zhawgd0REhA\",\"country\":\"IT\"}` restricts the result set to include data for the given videos in Italy. The parameter value can specify up to 500 IDs. For more details on the filters parameter, see the filters parameter in [Parameters](https://developers.google.com/youtube/analytics/reference/reports/query#Parameters) section.",
    optional: true,
  },
};
