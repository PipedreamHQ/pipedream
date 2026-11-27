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
      description: "Only this teammate's new connections. Select one from the list (it is loaded from your team members), or enter a user ID, e.g. `86632827-b7c3-4533-b2bb-04d6d9bda6cf`. Leave empty for everyone you can access.",
    },
  },
  methods: {
    ...common.methods,
    async fetchEvents() {
      const connectedFromUtc = this.daysAgoIso(7);
      const rows = await this.paginate(async (cursor) => {
        const response = await this.firsttouch.listTeamConnections({
          data: {
            mode: this.teammateId
              ? "connections_of_team_member"
              : undefined,
            ownerUserId: this.teammateId || undefined,
            connectedFromUtc,
            limit: 100,
            cursor,
          },
        });
        return {
          items: response.connections?.items,
          cursor: response.connections?.cursor,
        };
      });
      return rows.map((row) => {
        const connection = row.connection || {};
        const owner = row.owner || {};
        const account = row.linkedinAccount || {};
        return {
          // relationId is FirstTouch's own ID for this connection; member IDs can be missing.
          id: connection.relationId
            || `${account.linAccountId}:${connection.memberId || connection.publicIdentifier || connection.publicProfileUrl}`,
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
