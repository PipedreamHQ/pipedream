import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-get-email-open-counts",
  name: "Get Email Open Counts",
  description: "Gets total counts of recipients who opened your emails. This is only recorded when open tracking is enabled for that email. [See the documentation](https://postmarkapp.com/developer/api/stats-api#email-open-counts)",
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
    const response = await this.postmark.getEmailOpenCounts({
      $,
      params: {
        tag: this.tag,
        fromdate: this.fromdate,
        todate: this.todate,
        messagestream: this.messagestream,
      },
    });

    $.export("$summary", "Successfully fetched opened email counts!");
    return response;
  },
};
