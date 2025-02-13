import onelogin from "../../onelogin.app.mjs";

export default {
  key: "onelogin-revoke-user-sessions",
  name: "Revoke User Sessions",
  description: "Revokes all active sessions for a specified user in OneLogin. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    onelogin,
    revokeUserId: {
      propDefinition: [
        onelogin,
        "revokeUserId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.onelogin.revokeUserSessions(this.revokeUserId);
    $.export("$summary", `Successfully revoked sessions for user ID ${this.revokeUserId}`);
    return response;
  },
};
