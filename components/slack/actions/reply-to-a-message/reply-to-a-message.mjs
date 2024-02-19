import slack from "../../slack.app.mjs";
import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "slack-reply-to-a-message",
  name: "Reply to a Message Thread",
  description: "Send a message as a threaded reply. See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.1.19",
  type: "action",
  props: {
    slack: common.props.slack,
    thread_ts: {
      propDefinition: [
        slack,
        "thread_ts",
      ],
      optional: false,
    },
    reply_broadcast: {
      propDefinition: [
        slack,
        "reply_broadcast",
      ],
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
    ...common.props,
  },
};
