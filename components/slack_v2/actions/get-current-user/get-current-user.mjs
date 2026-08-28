// x-pd-ai: optimized
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-current-user",
  name: "Get Current User",
  description: "Do NOT use for a plain \"who am I\" / \"what's my user ID\" question — call **Get User Details** for that; it answers the same question with a far smaller payload. Do NOT use to look up a DIFFERENT, specifically-identified user (by ID or email) — this only ever describes the authenticated caller; use **Find User by ID** / **Find User by Email** for someone else. Do NOT use to enumerate multiple teams/workspaces (e.g. Enterprise Grid) — use **List Teams** for that; this returns only the caller's own current team. Use this ONLY when you specifically need the full member profile: locale, timezone, presence/status, admin and owner flags, name variants, or workspace domain and enterprise metadata. Combines `auth.test`, `users.info`, `users.profile.get` and `team.info`. [See Slack API docs](https://api.slack.com/methods/auth.test).",
  version: "0.0.7",
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
    if (!userId) {
      throw new Error(`Unable to determine user ID from auth context. Received: ${JSON.stringify(authContext)}`);
    }

    let userInfo;
    try {
      userInfo = await this.slack.usersInfo({
        user: userId,
        include_locale: true,
      });
    } catch (error) {
      // Gracefully degrade if scope not available
    }

    let userProfile;
    try {
      userProfile = await this.slack.getUserProfile({
        user: userId,
      });
    } catch (error) {
      // Gracefully degrade if scope not available
    }

    let teamInfo;
    try {
      teamInfo = await this.slack.getTeamInfo();
    } catch (error) {
      // Gracefully degrade if scope not available
    }

    const user = userInfo?.user;
    const profile = userProfile?.profile ?? user?.profile;
    const summaryName =
      profile?.real_name_normalized
      || profile?.display_name_normalized
      || authContext.user
      || userId;

    $.export("$summary", `Retrieved Slack user ${summaryName}`);

    return {
      authContext,
      user,
      profile,
      team: teamInfo?.team,
    };
  },
};
