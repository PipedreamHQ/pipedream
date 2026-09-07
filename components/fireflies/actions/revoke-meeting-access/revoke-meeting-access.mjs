import fireflies from "../../fireflies.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "fireflies-revoke-meeting-access",
  name: "Revoke Meeting Access",
  description: "Revoke a previously shared meeting's access for a specific email address. Access can be re-granted at any time with **Share Meeting**. [See the documentation](https://docs.fireflies.ai/graphql-api/mutation/revoke-shared-meeting-access)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    fireflies,
    meetingId: {
      propDefinition: [
        fireflies,
        "meetingId",
      ],
      description: "The meeting to revoke access to. Use **Find Meeting by ID** or **Find Recent Meeting** to look up a meeting ID.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address to revoke access for, e.g. `jane@example.com`.",
    },
  },
  async run({ $ }) {
    const { data: { revokeSharedMeetingAccess } } = await this.fireflies.query({
      $,
      data: {
        query: mutations.revokeSharedMeetingAccess,
        variables: {
          input: {
            meeting_id: this.meetingId,
            email: this.email,
          },
        },
      },
    });

    if (!revokeSharedMeetingAccess.success) {
      throw new Error(`Failed to revoke access to meeting ${this.meetingId} for ${this.email}: ${revokeSharedMeetingAccess.message}`);
    }

    $.export("$summary", `Revoked access to meeting ${this.meetingId} for ${this.email}`);
    return revokeSharedMeetingAccess;
  },
};
