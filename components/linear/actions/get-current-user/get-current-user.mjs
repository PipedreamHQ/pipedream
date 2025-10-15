import linearApp from "../../linear.app.mjs";

const DEFAULT_CONNECTION_LIMIT = 50;

const toIsoString = (value) => value?.toISOString?.() ?? null;
const toPageInfo = (pageInfo) => pageInfo && ({
  endCursor: pageInfo.endCursor,
  hasNextPage: pageInfo.hasNextPage,
  hasPreviousPage: pageInfo.hasPreviousPage,
  startCursor: pageInfo.startCursor,
});

export default {
  key: "linear-get-current-user",
  name: "Get Current User",
  description: "Retrieve rich context about the authenticated Linear user, including core profile fields, recent timestamps, direct team memberships, and high-level organization settings. Returns the user object, a paginated team list (with names, keys, cycle configs, etc.), associated team memberships, and organization metadata such as auth defaults and SCIM/SAML flags. Use this when your workflow or agent needs to understand who is currently authenticated, which teams they belong to, or what workspace policies might influence subsequent Linear actions. Uses OAuth authentication. See Linear's GraphQL viewer docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
  },
  async run({ $ }) {
    const client = this.linearApp.client();
    const viewer = await client.viewer;

    const [
      organization,
      teamsConnection,
      teamMembershipsConnection,
    ] = await Promise.all([
      viewer.organization,
      viewer.teams({
        first: DEFAULT_CONNECTION_LIMIT,
      }),
      viewer.teamMemberships({
        first: DEFAULT_CONNECTION_LIMIT,
      }),
    ]);

    const teams = teamsConnection?.nodes?.map((team) => ({
      id: team.id,
      key: team.key,
      name: team.name,
      displayName: team.displayName,
      description: team.description,
      icon: team.icon,
      color: team.color,
      private: team.private,
      timezone: team.timezone,
      inviteHash: team.inviteHash,
      issueCount: team.issueCount,
      cycleDuration: team.cycleDuration,
      cyclesEnabled: team.cyclesEnabled,
      triageEnabled: team.triageEnabled,
      createdAt: toIsoString(team.createdAt),
      updatedAt: toIsoString(team.updatedAt),
    })) ?? [];

    const user = {
      id: viewer.id,
      name: viewer.name,
      displayName: viewer.displayName,
      email: viewer.email,
      active: viewer.active,
      admin: viewer.admin,
      guest: viewer.guest,
      description: viewer.description,
      disableReason: viewer.disableReason,
      timezone: viewer.timezone,
      statusEmoji: viewer.statusEmoji,
      statusLabel: viewer.statusLabel,
      isAssignable: viewer.isAssignable,
      isMentionable: viewer.isMentionable,
      avatarUrl: viewer.avatarUrl,
      url: viewer.url,
      calendarHash: viewer.calendarHash,
      inviteHash: viewer.inviteHash,
      initials: viewer.initials,
      createdIssueCount: viewer.createdIssueCount,
      createdAt: toIsoString(viewer.createdAt),
      updatedAt: toIsoString(viewer.updatedAt),
      archivedAt: toIsoString(viewer.archivedAt),
      lastSeen: toIsoString(viewer.lastSeen),
      statusUntilAt: toIsoString(viewer.statusUntilAt),
    };

    const teamMemberships = teamMembershipsConnection?.nodes?.map((membership) => ({
      id: membership.id,
      owner: membership.owner,
      sortOrder: membership.sortOrder,
      teamId: membership.teamId,
      userId: membership.userId,
      createdAt: toIsoString(membership.createdAt),
      updatedAt: toIsoString(membership.updatedAt),
      archivedAt: toIsoString(membership.archivedAt),
    })) ?? [];

    const organizationData = organization && {
      id: organization.id,
      name: organization.name,
      urlKey: organization.urlKey,
      allowedAuthServices: organization.allowedAuthServices,
      allowMembersToInvite: organization.allowMembersToInvite,
      customersEnabled: organization.customersEnabled,
      feedEnabled: organization.feedEnabled,
      gitBranchFormat: organization.gitBranchFormat,
      gitLinkbackMessagesEnabled: organization.gitLinkbackMessagesEnabled,
      gitPublicLinkbackMessagesEnabled: organization.gitPublicLinkbackMessagesEnabled,
      initiativeUpdateReminderFrequencyInWeeks:
        organization.initiativeUpdateReminderFrequencyInWeeks,
      initiativeUpdateRemindersDay: organization.initiativeUpdateRemindersDay,
      initiativeUpdateRemindersHour: organization.initiativeUpdateRemindersHour,
      projectUpdateReminderFrequencyInWeeks:
        organization.projectUpdateReminderFrequencyInWeeks,
      projectUpdateRemindersDay: organization.projectUpdateRemindersDay,
      projectUpdateRemindersHour: organization.projectUpdateRemindersHour,
      projectUpdatesReminderFrequency: organization.projectUpdatesReminderFrequency,
      restrictLabelManagementToAdmins: organization.restrictLabelManagementToAdmins,
      restrictTeamCreationToAdmins: organization.restrictTeamCreationToAdmins,
      roadmapEnabled: organization.roadmapEnabled,
      samlEnabled: organization.samlEnabled,
      scimEnabled: organization.scimEnabled,
      releaseChannel: organization.releaseChannel,
      fiscalYearStartMonth: organization.fiscalYearStartMonth,
      slaDayCount: organization.slaDayCount,
      previousUrlKeys: organization.previousUrlKeys,
      logoUrl: organization.logoUrl,
      createdIssueCount: organization.createdIssueCount,
      customerCount: organization.customerCount,
      periodUploadVolume: organization.periodUploadVolume,
      userCount: organization.userCount,
      trialEndsAt: toIsoString(organization.trialEndsAt),
      deletionRequestedAt: toIsoString(organization.deletionRequestedAt),
      archivedAt: toIsoString(organization.archivedAt),
      createdAt: toIsoString(organization.createdAt),
      updatedAt: toIsoString(organization.updatedAt),
    };

    const summaryIdentifier = user.name || user.displayName || user.email || user.id;
    $.export("$summary", `Retrieved Linear user ${summaryIdentifier}`);

    return {
      user,
      organization: organizationData,
      teams: {
        nodes: teams,
        pageInfo: toPageInfo(teamsConnection?.pageInfo),
      },
      teamMemberships: {
        nodes: teamMemberships,
        pageInfo: toPageInfo(teamMembershipsConnection?.pageInfo),
      },
    };
  },
};
