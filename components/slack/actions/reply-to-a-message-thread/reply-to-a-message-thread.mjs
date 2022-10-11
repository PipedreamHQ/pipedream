import slack from "../../slack.app.mjs";
import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "slack-reply-to-a-message",
  name: "Reply to a Message Thread",
  description: "Send a message as a threaded reply. See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.1.7",
  type: "action",
  props: {
    ...common.props,
    thread_ts: {
      propDefinition: [
        slack,
        "thread_ts",
      ],
      optional: false,
    },
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
      optional: false,
    },
    text: {
      propDefinition: [
        slack,
        "text",
      ],
      optional: false,
    },
    mrkdwn: {
      propDefinition: [
        slack,
        "mrkdwn",
      ],
    },
  },
};
