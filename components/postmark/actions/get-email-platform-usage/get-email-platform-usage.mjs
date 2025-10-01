import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-get-email-platform-usage",
  name: "Get Email Platform Usage",
  description: "Gets an overview of the platforms used to open your emails. This is only recorded when open tracking is enabled for that email. [See the documentation](https://postmarkapp.com/developer/api/stats-api#email-platform-usage)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postmark,
    tag: {
      propDefinition: [
        postmark,
        "tag",
      ],
    },
    fromdate: {
      propDefinition: [
        postmark,
        "fromdate",
      ],
    },
    todate: {
      propDefinition: [
        postmark,
        "todate",
      ],
    },
    messagestream: {
      propDefinition: [
        postmark,
        "messagestream",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.postmark.getEmailPlatformUsage({
      $,
      params: {
        tag: this.tag,
        fromdate: this.fromdate,
        todate: this.todate,
        messagestream: this.messagestream,
      },
    });

    $.export("$summary", "Successfully fetched email platform usage!");
    return response;
  },
};
