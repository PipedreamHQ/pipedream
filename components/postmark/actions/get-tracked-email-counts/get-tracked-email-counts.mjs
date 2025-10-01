import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-get-tracked-email-counts",
  name: "Get Tracked Email Counts",
  description: "Gets a total count of emails you've sent with open tracking or link tracking enabled. [See the documentation](https://postmarkapp.com/developer/api/stats-api#email-tracked-count)",
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
    const response = await this.postmark.getTrackedEmailCounts({
      $,
      params: {
        tag: this.tag,
        fromdate: this.fromdate,
        todate: this.todate,
        messagestream: this.messagestream,
      },
    });

    $.export("$summary", "Successfully fetched tracked emails count!");
    return response;
  },
};
