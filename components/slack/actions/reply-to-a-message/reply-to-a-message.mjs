import slack from "../../slack.app.mjs";
import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "slack-reply-to-a-message",
  name: "Reply to a Message Thread",
  description: "Send a message as a threaded reply. See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.1.28",
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
    replyToThread: {
      ...common.props.replyToThread,
      hidden: true,
    },
    thread_ts: {
      propDefinition: [
        slack,
        "messageTs",
      ],
    },
    thread_broadcast: {
      propDefinition: [
        slack,
        "thread_broadcast",
      ],
    },
  },
};
