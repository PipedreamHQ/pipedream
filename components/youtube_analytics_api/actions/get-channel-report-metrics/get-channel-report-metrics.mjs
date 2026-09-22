import app from "../../youtube_analytics_api.app.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "youtube_analytics_api-get-channel-report-metrics",
  name: "Get Channel Report Metrics",
  description:
    "Retrieve the supported metrics for a specified channel report type. [See the documentation](https://developers.google.com/youtube/analytics/channel_reports)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    channelReportType: propsFragments.channelReportType,
  },
  async run({ $ }) {
    const reportType = utils.getChannelReportTypeOrThrow(this.channelReportType);
    const { metrics } = reportType.metadata;

    $.export(
      "$summary",
      `Successfully retrieved ${metrics.length} metric${metrics.length === 1
        ? ""
        : "s"} for **${reportType.label}**.`,
    );
    return metrics;
  },
};
