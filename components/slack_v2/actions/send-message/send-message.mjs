import common from "../common/send-message.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "slack_v2-send-message",
  name: "Send Message",
  description:
    "Send a message to a user, group, private channel or public channel."
    + " Legacy variant — prefer **Post Message** for new integrations: it covers channels,"
    + " users, and groups from a single tool, supports threaded replies and unfurl settings."
    + " When **Send as User** is left unset, direct messages are posted as the authenticated"
    + " user (so they are not prefixed with the `Pipedream:` bot name in Slack notifications)"
    + " and channel messages are posted as the bot. Set **Send as User** to `false` when you"
    + " need bot authorship, including in direct messages."
    + " [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    slack: common.props.slack,
    channelType: {
      type: "string",
      label: "Channel Type",
      description: "The type of channel to send to: `Channels` (public or private), Group (`mpim`), or User/Direct Message (`im`). Informational only — it does not affect which value is accepted in Channel.",
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
