import hypeauditor from "../../hypeauditor.app.mjs";

export default {
  key: "hypeauditor-get-twitch-report",
  name: "Get Twitch Report",
  description: "Generates a Twitch report for a specified channel. [See the documentation](https://hypeauditor.readme.io/reference/report_twitch)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hypeauditor,
    channel: {
      propDefinition: [
        hypeauditor,
        "twitchChannel",
      ],
    },
  },
  async run({ $ }) {
    const {
      hypeauditor, ...params
    } = this;
    const response = await hypeauditor.getTwitchReport({
      $,
      params,
    });
    $.export("$summary", `Successfully fetched Twitch report for channel ${this.channel}`);
    return response;
  },
};
