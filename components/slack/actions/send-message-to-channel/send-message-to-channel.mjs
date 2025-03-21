import common from "../common/send-message.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "slack-send-message-to-channel",
  name: "Send Message to Channel",
  description: "Send a message to a public or private channel. [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.0.4",
  type: "action",
  props: {
    slack: common.props.slack,
    conversation: {
      propDefinition: [
        common.props.slack,
        "conversation",
        () => ({
          types: [
            constants.CHANNEL_TYPE.PUBLIC,
            constants.CHANNEL_TYPE.PRIVATE,
          ],
        }),
      ],
      description: "Select a public or private channel",
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
