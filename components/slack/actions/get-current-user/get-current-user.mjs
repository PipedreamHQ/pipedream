import slack from "../../slack.app.mjs";

export default {
  key: "slack-get-current-user",
  name: "Get Current User",
  description: "Retrieve comprehensive context about the authenticated Slack member, combining `auth.test`, `users.info`, `users.profile.get`, and `team.info` payloads. Returns the user’s profile (name variants, email, locale, timezone, status, admin flags), raw auth test data, and workspace metadata (domain, enterprise info, icons). Ideal when you need to confirm which user token is active, tailor messages to their locale/timezone, or ground an LLM in the member’s role and workspace before executing other Slack actions. [See Slack API docs](https://api.slack.com/methods/auth.test).",
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
