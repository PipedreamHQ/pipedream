import common from "../common/send-message.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "slack-send-message",
  name: "Send Message",
  description: "Send a message to a user, group, private channel or public channel. [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.0.20",
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
      description: "The type of channel to send to. User/Direct Message (im), Group (mpim), Private Channel or Public Channel",
      async options() {
        return constants.CHANNEL_TYPE_OPTIONS;
      },
    },
    conversation: {
      propDefinition: [
        common.props.slack,
        "conversation",
        (c) => ({
          types: c.channelType === "Channels"
            ? [
              constants.CHANNEL_TYPE.PUBLIC,
              constants.CHANNEL_TYPE.PRIVATE,
            ]
            : [
              c.channelType,
            ],
        }),
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
