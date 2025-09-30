import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-get-bounce-counts",
  name: "Get Bounce Counts",
  description: "Gets total counts of emails you've sent out that have been returned as bounced. [See the documentation](https://postmarkapp.com/developer/api/stats-api#bounce-counts)",
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
    const response = await this.postmark.getBounceCounts({
      $,
      params: {
        tag: this.tag,
        fromdate: this.fromdate,
        todate: this.todate,
        messagestream: this.messagestream,
      },
    });

    $.export("$summary", "Successfully fetched bounce counts!");
    return response;
  },
};
