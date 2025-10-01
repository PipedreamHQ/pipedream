import common from "../common.mjs";

export default {
  ...common,
  name: "Block User",
  key: "twitch-block-user",
  description: "Blocks a user; that is, adds a specified target user to your blocks list",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    user: {
      propDefinition: [
        common.props.twitch,
        "user",
      ],
      description: "User ID of the user to be blocked",
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
  async run() {
    const params = {
      target_user_id: this.user,
      source_context: this.sourceContext,
      reason: this.reason,
    };
    const {
      status,
      statusText,
    } = await this.twitch.blockUser(params);
    return status == 204
      ? "User Blocked Successfully"
      : `${status} ${statusText}`;
  },
};
