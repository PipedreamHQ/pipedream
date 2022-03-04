import common from "../send-message-common.mjs";

export default {
  ...common,
  key: "slack-send-block-kit-message",
  name: "Send Message Using Block Kit",
  description: "Send a message using Slack's Block Kit UI framework to a channel, group or user",
  version: "0.2.1",
  type: "action",
  props: {
    ...common.props,
    conversation: {
      propDefinition: [
        common.props.slack,
        "conversation",
      ],
      optional: false,
    },
    blocks: {
      propDefinition: [
        common.props.slack,
        "blocks",
      ],
      optional: false,
    },
    text: {
      propDefinition: [
        common.props.slack,
        "notificationText",
      ],
    },
  },
};
