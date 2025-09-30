import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "loopmessage-send-text-message",
  name: "Send Text Message",
  description: "Action to send a text in iMessage to an individual recipient. [See the documentation](https://docs.loopmessage.com/imessage-conversation-api/messaging/send-message#send-single-message)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    service: {
      propDefinition: [
        common.props.app,
        "service",
      ],
    },
    subject: {
      propDefinition: [
        common.props.app,
        "subject",
      ],
    },
    effect: {
      propDefinition: [
        common.props.app,
        "effect",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary(response) {
      return `Successfully sent a text message with ID \`${response.message_id}\``;
    },
  },
};
