// legacy_hash_id: a_eliYz4
import slackifyHtml from "slackify-html";
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-convert-html-to-slack-mrkdwn",
  name: "Helper Functions - Convert HTML to Slack mrkdwn format",
  description: "Converts an HTML string to the Slack mrkdwn format using",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
    html: {
      type: "string",
      label: "HTML",
    },
  },
  async run() {
    return slackifyHtml(this.html);
  },
};
