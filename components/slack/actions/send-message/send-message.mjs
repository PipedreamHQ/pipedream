import common from "../common/send-message.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "slack-send-message",
  name: "Send Message",
  description: "Send a message to a user, group, private channel or public channel. [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.0.1",
  type: "action",
  props: {
    slack: common.props.slack,
    channelType: {
      type: "string",
      label: "Channel Type",
      description: "The type of channel to send to. User (direct message), Group, Private Channel or Public Channel",
      options: Object.values(constants.CHANNEL_TYPE),
    },
    conversation: {
      propDefinition: [
        common.props.slack,
        "channelId",
        (c) => ({
          types: [
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
