import hypeauditor from "../../hypeauditor.app.mjs";

export default {
  key: "hypeauditor-get-youtube-report",
  name: "Get YouTube Report",
  description: "Generates a comprehensive YouTube report for a specified channel. [See the documentation](https://hypeauditor.readme.io/reference/report_youtube)",
  version: "0.0.1",
  type: "action",
  props: {
    hypeauditor,
    channel: {
      propDefinition: [
        hypeauditor,
        "youtubeChannel",
      ],
    },
    features: {
      propDefinition: [
        hypeauditor,
        "youtubeFeatures",
      ],
    },
  },
  async run({ $ }) {
    const {
      hypeauditor, ...params
    } = this;
    const response = await hypeauditor.getYouTubeReport({
      $,
      params,
    });
    $.export("$summary", `Successfully fetched YouTube report for channel ${this.channel}`);
    return response;
  },
};
