import slack from "../../slack_v2.app.mjs";
import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "slack_v2-reply-to-a-message",
  name: "Reply to a Message Thread",
  description: "Send a message as a threaded reply. [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.2.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack: common.props.slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    text: {
      propDefinition: [
        slack,
        "text",
      ],
    },
    mrkdwn: {
      propDefinition: [
        slack,
        "mrkdwn",
      ],
    },
    ...common.props,
    thread_ts: {
      propDefinition: [
        slack,
        "messageTs",
      ],
      label: "Thread Timestamp",
      description: "The `ts` timestamp of the parent message to reply to (e.g., if triggering on new Slack messages, enter `{{event.ts}}`). Avoid using a reply's `ts` value; use its parent's instead. E.g., `1403051575.000407`.",
      optional: false,
    },
  },
};
