import hypeauditor from "../../hypeauditor.app.mjs";

export default {
  key: "hypeauditor-get-tiktok-report",
  name: "Get TikTok Report",
  description: "Generates a comprehensive TikTok report for a specified channel. [See the documentation](https://hypeauditor.readme.io/reference/report_tiktok)",
  version: "0.0.1",
  type: "action",
  props: {
    hypeauditor,
    channel: {
      propDefinition: [
        hypeauditor,
        "tiktokChannel",
      ],
    },
  },
  async run({ $ }) {
    const {
      hypeauditor, ...params
    } = this;
    const response = await hypeauditor.getTiktokReport({
      $,
      params,
    });
    $.export("$summary", `Successfully fetched TikTok report for channel ${this.channel}`);
    return response;
  },
};
