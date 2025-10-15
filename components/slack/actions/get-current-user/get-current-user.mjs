import slack from "../../slack.app.mjs";

export default {
  key: "slack-get-current-user",
  name: "Get Current User",
  description: "Retrieve comprehensive context about the authenticated Slack member, combining `auth.test`, `users.info`, `users.profile.get`, and `team.info` payloads. Returns the user’s profile (name variants, email, locale, timezone, status, admin flags), raw auth test data, and workspace metadata (domain, enterprise info, icons). Ideal when you need to confirm which user token is active, tailor messages to their locale/timezone, or ground an LLM in the member’s role and workspace before executing other Slack actions. Uses OAuth authentication. [See Slack API docs](https://api.slack.com/methods/auth.test).",
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

    $.export(
      "$summary",
      `Retrieved Slack user ${summaryName}`,
    );

    return {
      authContext,
      user: user && {
        id: user.id,
        teamId: user.team_id,
        name: profile?.real_name_normalized || user.real_name,
        displayName: profile?.display_name_normalized || user.name,
        email: profile?.email,
        locale: user.locale,
        timezone: user.tz,
        timezoneLabel: user.tz_label,
        timezoneOffset: user.tz_offset,
        isAdmin: user.is_admin,
        isOwner: user.is_owner,
        isPrimaryOwner: user.is_primary_owner,
        isRestricted: user.is_restricted,
        isUltraRestricted: user.is_ultra_restricted,
        isBot: user.is_bot,
        isAppUser: user.is_app_user,
        updated: user.updated,
        color: user.color,
        profile,
      },
      team: teamInfo?.team && {
        id: teamInfo.team.id,
        name: teamInfo.team.name,
        domain: teamInfo.team.domain,
        emailDomain: teamInfo.team.email_domain,
        icon: teamInfo.team.icon,
        enterpriseId: teamInfo.team.enterprise_id,
        enterpriseName: teamInfo.team.enterprise_name,
      },
    };
  },
};
