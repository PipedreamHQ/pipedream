import app from "../../hypeauditor.app.mjs";

export default {
  key: "hypeauditor-get-tiktok-report",
  name: "Get Tiktok Report",
  description: "Returns a report about the specified Tiktok channel. [See the documentation](https://hypeauditor.readme.io/reference/get_report_tiktok)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    channelUsername: {
      propDefinition: [
        app,
        "channelUsername",
      ],
      optional: false,
    },
  },

  async run({ $ }) {
    const response = await this.app.getTiktokReport({
      $,
      data: {
        channel: this.channelUsername,
      },
    });
    $.export("$summary", `Successfully sent the request. Report state: '${response.result.report_state}'`);

    return response;
  },
};
