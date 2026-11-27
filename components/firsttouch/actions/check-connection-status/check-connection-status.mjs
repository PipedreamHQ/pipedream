import firsttouch from "../../firsttouch.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "firsttouch-check-connection-status",
  name: "Check Connection Status",
  description: "Check whether anyone on your team is connected to a contact on LinkedIn, using saved FirstTouch connection data. [See the documentation](https://docs.firsttouch.com)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    firsttouch,
    linkedinUrl: {
      propDefinition: [
        firsttouch,
        "linkedinUrl",
      ],
    },
    teammateId: {
      propDefinition: [
        firsttouch,
        "teammateId",
      ],
      description: "Only check this teammate. Select one from the list (it is loaded from your team members), or enter a user ID, e.g. `86632827-b7c3-4533-b2bb-04d6d9bda6cf`. Leave empty to check everyone on your team.",
    },
  },
  async run({ $ }) {
    const linkedinUrl = utils.normalizeProfileUrl(this.linkedinUrl);
    const response = await this.firsttouch.listTeamConnections({
      $,
      data: {
        mode: "team_members_connected_to_person",
        connectedPersonLinkedInUrl: linkedinUrl,
        ownerUserId: this.teammateId || undefined,
        limit: 100,
      },
    });
    const rows = response.connections?.items || [];
    const first = rows[0]?.connection || {};
    const result = {
      linkedinUrl,
      isConnected: rows.length > 0,
      connectedTeammateCount: rows.length,
      connectedTeammates: rows.map((row) => row.owner?.name).filter(Boolean)
        .join(", "),
      connectedTeammateEmails: rows.map((row) => row.owner?.email).filter(Boolean)
        .join(", "),
      firstConnectedTeammateUserId: rows[0]?.owner?.userId ?? null,
      connectedAtUtc: first.connectedAtUtc ?? null,
      fullName: first.fullName ?? null,
      headline: first.headline ?? null,
    };
    $.export("$summary", result.isConnected
      ? `Connected to ${result.connectedTeammates}`
      : "No teammate is connected to this contact");
    return result;
  },
};
