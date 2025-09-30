import common from "../common/reports-query.mjs";
import utils from "../../common/utils.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "youtube_analytics_api-get-video-metrics",
  name: "Get Video Metrics",
  description:
    "Retrieve detailed analytics for a specific video. [See the documentation](https://developers.google.com/youtube/analytics/reference/reports/query)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    videoId: {
      type: "string",
      label: "Video ID",
      description:
        "The ID of the video for which you want to retrieve metrics. Eg. `pd1FJh59zxQ`.",
    },
    metrics: propsFragments.metrics,
  },
  additionalProps() {
    return this.getIdsProps();
  },
  async run({ $ }) {
    const {
      app,
      videoId,
      getIdsParam,
      startDate,
      endDate,
      metrics,
      dimensions,
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
        dimensions: utils.arrayToCommaSeparatedList(dimensions),
        sort: utils.arrayToCommaSeparatedList(sort),
        maxResults,
        filters: `video==${videoId}`,
      },
    });

    $.export("$summary", "Successfully fetched video metrics.");
    return response;
  },
};
