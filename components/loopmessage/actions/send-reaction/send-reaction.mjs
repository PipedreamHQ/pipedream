import common from "../common/send-message.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "loopmessage-send-reaction",
  name: "Send Reaction",
  description: "Action to submit your request to the sending queue. When a request in the queue will be ready to send a reaction in iMessage, an attempt will be made to deliver it to the recipient. [See the documentation](https://docs.loopmessage.com/imessage-conversation-api/messaging/send-message#send-reaction)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message to react to. You can get it from the webhook trigger.",
    },
    reaction: {
      type: "string",
      label: "Reaction",
      description: "Reactions that starts with `-` mean *remove* it from the message. You can check the [Apple guide](https://support.apple.com/HT206894) about reactions and tapbacks.",
      options: constants.REACTIONS,
    },
  },
  methods: {
    ...common.methods,
    getSummary(response) {
      return `Successfully sent a reaction to with ID \`${response.message_id}\``;
    },
  },
};
