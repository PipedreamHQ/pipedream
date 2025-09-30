import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-get-click-counts",
  name: "Get Click Counts",
  description: "Gets total counts of unique links that were clicked. [See the documentation](https://postmarkapp.com/developer/api/stats-api#click-counts)",
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
    const response = await this.postmark.getClickCounts({
      $,
      params: {
        tag: this.tag,
        fromdate: this.fromdate,
        todate: this.todate,
        messagestream: this.messagestream,
      },
    });

    $.export("$summary", "Successfully fetched click counts!");
    return response;
  },
};
