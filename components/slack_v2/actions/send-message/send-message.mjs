import common from "../common/send-message.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "slack_v2-send-message",
  name: "Send Message",
  description: "Send a message to a user, group, private channel or public channel. [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.1.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack: common.props.slack,
    channelType: {
      type: "string",
      label: "Channel Type",
      description: "The type of channel to send to: User/Direct Message (`im`), Group (`mpim`), Private Channel, or Public Channel. Informational only — it does not affect which value is accepted in Channel.",
      options: constants.CHANNEL_TYPE_OPTIONS,
      optional: true,
    },
    conversation: {
      propDefinition: [
        common.props.slack,
        "conversation",
      ],
    },
    text: {
      propDefinition: [
        common.props.slack,
        "text",
      ],
    },
    mrkdwn: {
      propDefinition: [
        common.props.slack,
        "mrkdwn",
      ],
    },
    ...common.props,
  },
};
