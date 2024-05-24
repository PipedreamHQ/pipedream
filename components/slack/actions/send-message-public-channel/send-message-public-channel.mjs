import constants from "../../common/constants.mjs";
import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "slack-send-message-public-channel",
  name: "Send Message to a Public Channel",
  description: "Send a message to a public channel and customize the name and avatar of the bot that posts the message. See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.2.20",
  type: "action",
  props: {
    slack: common.props.slack,
    conversation: {
      propDefinition: [
        common.props.slack,
        "channelId",
        () => ({
          types: [
            constants.CHANNEL_TYPE.PUBLIC,
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
