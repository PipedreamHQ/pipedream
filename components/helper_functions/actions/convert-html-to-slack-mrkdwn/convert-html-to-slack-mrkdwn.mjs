// legacy_hash_id: a_eliYz4
import slackifyHtml from "slackify-html";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-convert-html-to-slack-mrkdwn",
  name: "Convert HTML to Slack mrkdwn format",
  description: "Converts an HTML string to the Slack mrkdwn format using",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helper_functions,
    html: {
      type: "string",
      label: "HTML",
    },
  },
  async run() {
    return slackifyHtml(this.html);
  },
};
