import hypeauditor from "../../hypeauditor.app.mjs";

export default {
  key: "hypeauditor-get-youtube-report",
  name: "Get YouTube Report",
  description: "Generates a comprehensive YouTube report for a specified channel. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hypeauditor,
    youtubeChannel: {
      propDefinition: [
        hypeauditor,
        "youtubeChannel",
      ],
    },
    youtubeFeatures: {
      propDefinition: [
        hypeauditor,
        "youtubeFeatures",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hypeauditor.getYouTubeReport({
      channel: this.youtubeChannel,
      features: this.youtubeFeatures,
    });
    $.export("$summary", `Successfully generated YouTube report for channel ${this.youtubeChannel}`);
    return response;
  },
};
