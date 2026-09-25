import slack from "../../slack_bot.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "slack_bot-list-messages",
  name: "List Messages",
  description: "Retrieve messages from a conversation (channel, DM, or group DM), including reactions (Bot). [See the documentation](https://api.slack.com/methods/conversations.history)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
        () => ({
          types: [
            constants.CHANNEL_TYPE.PUBLIC,
            constants.CHANNEL_TYPE.PRIVATE,
            constants.CHANNEL_TYPE.MPIM,
            constants.CHANNEL_TYPE.IM,
          ],
        }),
      ],
      description: `Select a public or private channel, or a user or group. ${utils.CONVERSATION_PERMISSION_MESSAGE}`,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to return (max 999). Default: 100.",
      default: 100,
      optional: true,
    },
    oldest: {
      type: "string",
      label: "Oldest",
      description: "Only return messages posted after this timestamp (inclusive), as a Slack timestamp, e.g. `1610000000.000000`.",
      optional: true,
    },
    latest: {
      type: "string",
      label: "Latest",
      description: "Only return messages posted before this timestamp. Defaults to now. Same format as `Oldest`, e.g. `1610000000.000000`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.slack.conversationsHistory({
      channel: this.conversation,
      limit: this.limit,
      oldest: this.oldest,
      latest: this.latest,
    });
    const messages = response.messages || [];

    $.export("$summary", `Successfully retrieved ${messages.length} message${messages.length === 1
      ? ""
      : "s"}`);
    return {
      messages,
    };
  },
};
