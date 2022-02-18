// legacy_hash_id: a_eliYz4
import slackifyHtml from "slackify-html";

export default {
  key: "pipedream-convert-html-to-slack-mrkdwn",
  name: "Convert HTML to Slack mrkdwn format",
  description: "Converts an HTML string to the Slack mrkdwn format using",
  version: "0.1.1",
  type: "action",
  props: {
    html: {
      type: "string",
      label: "HTML",
    },
  },
  async run() {
    return slackifyHtml(this.html);
  },
};
