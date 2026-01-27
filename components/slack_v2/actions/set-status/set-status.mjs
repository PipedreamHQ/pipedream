import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-set-status",
  name: "Set Status",
  description: "Set the current status for a user. [See the documentation](https://api.slack.com/methods/users.profile.set)",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack,
    statusText: {
      type: "string",
      label: "Status Text",
      description: "The displayed text",
    },
    statusEmoji: {
      propDefinition: [
        slack,
        "icon_emoji",
      ],
      label: "Status Emoji",
      description: "The emoji to display with the status",
      optional: true,
    },
    statusExpiration: {
      type: "string",
      label: "Status Expiration",
      description: "The datetime of when the status will expire in ISO 8601 format. (Example: `2014-01-01T00:00:00Z`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.slack.updateProfile({
      profile: {
        status_text: this.statusText,
        status_emoji: this.statusEmoji && `:${this.statusEmoji}:`,
        status_expiration: this.statusExpiration
          && Math.floor(new Date(this.statusExpiration).getTime() / 1000),
      },
    });
    $.export("$summary", "Successfully updated status.");
    return response;
  },
};
