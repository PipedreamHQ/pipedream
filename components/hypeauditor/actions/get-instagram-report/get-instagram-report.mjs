import app from "../../hypeauditor.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "hypeauditor-get-instagram-report",
  name: "Get Instagram Report",
  description: "Returns a report about the specified Instagram user. [See the documentation](https://hypeauditor.readme.io/reference/report_instagram#requests)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    username: {
      propDefinition: [
        app,
        "username",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },

  async run({ $ }) {
    if (!this.userId && !this.username) {
      throw new ConfigurationError("You need to provide either a User ID or Username");
    }

    const response = await this.app.getInstagramReport({
      $,
      params: {
        username: this.userId ?? this.username,
        v: "2",
      },

    });

    $.export("$summary", `Successfully sent the request. Report state: '${response.result.report_state}'`);

    return response;
  },
};
