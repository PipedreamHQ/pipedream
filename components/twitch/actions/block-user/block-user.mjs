import common from "../common.mjs";

export default {
  ...common,
  name: "Block User",
  key: "twitch-block-user",
  description: "Blocks the specified user. [See the documentation](https://dev.twitch.tv/docs/api/reference/#block-user)",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    user: {
      propDefinition: [
        common.props.twitch,
        "user",
      ],
    },
    sourceContext: {
      type: "string",
      label: "Source Context",
      description: "Source context for blocking the user. Valid values: \"chat\", \"whisper\".",
      optional: true,
      options: [
        "chat",
        "whisper",
      ],
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Reason for blocking the user. Valid values: \"spam\", \"harassment\", or \"other\".",
      optional: true,
      options: [
        "spam",
        "harassment",
        "other",
      ],
    },
  },
  async run({ $ }) {
    const targetUserId = await this.twitch.resolveUserId(this.user);
    const params = {
      target_user_id: targetUserId,
      source_context: this.sourceContext,
      reason: this.reason,
    };
    const {
      status,
      statusText,
    } = await this.twitch.blockUser(params);
    const summary = status == 204
      ? `Blocked user ${targetUserId}`
      : `Block failed: ${status} ${statusText}`;
    $.export("$summary", summary);
    return summary;
  },
};
