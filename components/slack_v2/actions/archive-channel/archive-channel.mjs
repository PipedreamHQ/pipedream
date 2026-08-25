import { ConfigurationError } from "@pipedream/platform";
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-archive-channel",
  name: "Archive Channel",
  description: "Archive a public or private channel. Direct messages and group DMs can't be archived — pass a channel ID (e.g. `C1234567890`), not a user or group ID. [See the documentation](https://api.slack.com/methods/conversations.archive)",
  version: "0.0.32",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
  },
  async run({ $ }) {
    let response;
    try {
      response = await this.slack.archiveConversations({
        channel: this.conversation,
      });
    } catch (error) {
      if (`${error}`.includes("method_not_supported_for_channel_type")) {
        throw new ConfigurationError(
          "Slack only allows archiving public or private channels — direct messages and"
          + " group DMs can't be archived. Provide a channel ID (e.g. `C1234567890`) instead.",
        );
      }
      throw error;
    }
    $.export("$summary", "Successfully archived channel.");
    return response;
  },
};
