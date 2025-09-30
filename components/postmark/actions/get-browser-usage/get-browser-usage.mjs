import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-get-browser-usage",
  name: "Get Browser Usage",
  description: "Gets an overview of the browsers used to open links in your emails. This is only recorded when Link Tracking is enabled for that email. [See the documentation](https://postmarkapp.com/developer/api/stats-api#browser-usage)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.postmark.getBrowserUsage({
      $,
      params: {
        tag: this.tag,
        fromdate: this.fromdate,
        todate: this.todate,
        messagestream: this.messagestream,
      },
    });

    $.export("$summary", "Successfully fetched browser usage!");
    return response;
  },
};
