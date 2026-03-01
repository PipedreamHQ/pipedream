import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-find-user-by-id",
  name: "Find User by ID",
  description: "Find a user by their ID. Returns user profile information including name, email (requires `users:read.email` scope), timezone, and status. [See the documentation](https://api.slack.com/methods/users.info)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack,
    user: {
      propDefinition: [
        slack,
        "user",
      ],
      description: "Select a user or enter a user ID (e.g., `U1234567890`)",
    },
    includeLocale: {
      type: "boolean",
      label: "Include Locale",
      description: "Set to `true` to receive the locale for this user",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    try {
      response = await this.slack.usersInfo({
        user: this.user,
        include_locale: this.includeLocale,
      });
    } catch (err) {
      $.export("$summary", `Failed to find user ${this.user}: ${err.message || err}`);
      throw err;
    }

    const displayName = response.user.profile?.display_name
      || response.user.profile?.real_name
      || response.user.name
      || this.user;
    $.export("$summary", `Successfully found user ${displayName}`);

    return response;
  },
};
