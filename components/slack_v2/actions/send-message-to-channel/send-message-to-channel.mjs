import common from "../common/send-message.mjs";

export default {
  ...common,
  key: "slack_v2-send-message-to-channel",
  name: "Send Message to Channel",
  description:
    "Send a message to a public or private channel."
    + " Legacy, channel-only variant — prefer **Post Message** for new integrations: it"
    + " covers channels, users, and groups from a single tool, and also supports threaded"
    + " replies and unfurl settings. Use this tool only if a workflow specifically needs to"
    + " target a channel exclusively, without the user/group support **Post Message** offers."
    + " [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack: common.props.slack,
    conversation: {
      propDefinition: [
        common.props.slack,
        "conversation",
      ],
      description: "A public or private channel ID (e.g. `C1234567890`). Use **List Channels** to find valid IDs.",
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
