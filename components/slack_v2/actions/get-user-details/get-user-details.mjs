import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-user-details",
  name: "Get User Details",
  description:
    "**Use when the user asks who am I, what's my user ID, what's my username, which workspace"
    + " am I in, or what's my email** — this is the default identity lookup and the one to call"
    + " first in any session."
    + " Returns user ID, name, email, timezone, profile, and workspace metadata."
    + " Other tools like **Search** and **List Channels** can then filter by your user ID,"
    + " and **Post Message** can use it as the channel to DM yourself."
    + " Prefer this over **Get Current User**, which returns a much larger payload and is only"
    + " needed for full profile detail (locale, status, admin flags)."
    + " [See the documentation](https://api.slack.com/methods/auth.test)",
  version: "0.0.2",
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
