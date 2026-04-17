import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-user-details",
  name: "Get User Details",
  description:
    "Retrieve the authenticated user's identity and workspace context."
    + " Returns user ID, name, email, timezone, profile, and workspace metadata."
    + " Call this first in any session to establish who you are — other tools like"
    + " **Search** and **List Channels** can then filter by your user ID."
    + " [See the documentation](https://api.slack.com/methods/auth.test)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack,
  },
  async run({ $ }) {
    const authContext = await this.slack.authTest();
    const userId = authContext.user_id || authContext.user;

    const { user } = await this.slack.usersInfo({
      user: userId,
      include_locale: true,
    });

    const { profile } = await this.slack.getUserProfile({
      user: userId,
    });

    const { team } = await this.slack.getTeamInfo();

    const displayName =
      profile?.real_name_normalized
      || profile?.display_name_normalized
      || authContext.user
      || userId;

    $.export("$summary", `Authenticated as ${displayName} in ${team?.name || authContext.team}`);

    return {
      user_id: userId,
      user,
      profile,
      team,
      authContext,
    };
  },
};
