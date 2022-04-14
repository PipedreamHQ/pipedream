import slack from "../../slack.app.mjs";
import common from "../send-message-common.mjs";

export default {
  ...common,
  key: "slack-reply-to-a-message",
  name: "Reply to a Message Thread",
  description: "Send a message as a threaded reply",
  version: "0.1.2",
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
    reply_channel: {
      propDefinition: [
        slack,
        "reply_channel",
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
  },
};
