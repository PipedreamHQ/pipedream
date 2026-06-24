import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-get-trends",
  name: "Get Trends",
  description: "Get trending public X/Twitter topics by region with Xquik. [See the documentation](https://docs.xquik.com/api-reference/x/trends)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    xquik,
    woeid: {
      propDefinition: [
        xquik,
        "woeid",
      ],
    },
    count: {
      propDefinition: [
        xquik,
        "count",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.getTrends({
      $,
      woeid: this.woeid,
      count: this.count,
    });

    const trends =
      response?.trends ?? response?.data ?? response?.results ?? [];
    const trendCount = Array.isArray(trends)
      ? trends.length
      : (response?.count ?? 0);

    $.export(
      "$summary",
      `Retrieved ${trendCount} trends for WOEID ${this.woeid ?? 1}`,
    );
    return response;
  },
};
