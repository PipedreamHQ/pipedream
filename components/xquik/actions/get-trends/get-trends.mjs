import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-get-trends",
  name: "Get Trends",
  description:
    "Get trending public X/Twitter topics by region with Xquik. [See the documentation](https://docs.xquik.com/api-reference/overview)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    xquik,
    woeid: {
      propDefinition: [xquik, "woeid"],
    },
    count: {
      propDefinition: [xquik, "count"],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.getTrends({
      $,
      woeid: this.woeid,
      count: this.count,
    });

    $.export("$summary", "Successfully retrieved trends");
    return response;
  },
};
