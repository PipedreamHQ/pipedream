import app from "../../hypeauditor.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "hypeauditor-get-youtube-report",
  name: "Get Youtube Report",
  description: "Returns a report about the specified Youtube channel. [See the documentation](https://hypeauditor.readme.io/reference/report_youtube)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
    },
    channelUsername: {
      propDefinition: [
        app,
        "channelUsername",
      ],
    },
  },

  async run({ $ }) {
    if (!this.channelId && !this.channelUsername) {
      throw new ConfigurationError("You need to inform a Channel ID or Channel Username");
    }

    const response = await this.app.getYoutubeReport({
      $,
      data: {
        channel: this.channelId ?? this.channelUsername,
      },
    });

    $.export("$summary", `Successfully sent the request. Report state: '${response.result.report_state}'`);

    return response;
  },
};
