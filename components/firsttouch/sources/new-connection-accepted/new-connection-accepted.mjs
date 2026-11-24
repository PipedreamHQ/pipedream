import common from "../common/base.mjs";

export default {
  ...common,
  key: "firsttouch-new-connection-accepted",
  name: "New Connection Accepted",
  description: "Emit new event when someone accepts a connection request and is now connected to a teammate on LinkedIn. Connections can sync to FirstTouch a few hours after they happen. [See the documentation](https://docs.firsttouch.com)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    teammateId: {
      propDefinition: [
        common.props.firsttouch,
        "teammateId",
      ],
      description: "Only this teammate's new connections. Leave empty for everyone you can access.",
    },
  },
  methods: {
    ...common.methods,
    async fetchEvents() {
      const response = await this.firsttouch.listTeamConnections({
        data: {
          mode: this.teammateId
            ? "connections_of_team_member"
            : undefined,
          ownerUserId: this.teammateId || undefined,
          connectedFromUtc: this.daysAgoIso(7),
          limit: 100,
        },
      });
      return (response.connections?.items || []).map((row) => {
        const connection = row.connection || {};
        const owner = row.owner || {};
        const account = row.linkedinAccount || {};
        return {
          id: `${account.linAccountId}:${connection.memberId || connection.publicIdentifier}`,
          occurredAt: connection.connectedAtUtc || "",
          data: {
            connectedAtUtc: connection.connectedAtUtc,
            fullName: connection.fullName,
            firstName: connection.firstName,
            lastName: connection.lastName,
            headline: connection.headline,
            linkedinUrl: connection.publicProfileUrl,
            publicIdentifier: connection.publicIdentifier,
            teammateUserId: owner.userId,
            teammateName: owner.name,
            teammateEmail: owner.email,
            linkedinAccountId: account.linAccountId,
          },
        };
      });
    },
    getSummary(row) {
      return `${row.fullName || "Someone"} connected with ${row.teammateName || "a teammate"}`;
    },
  },
};
