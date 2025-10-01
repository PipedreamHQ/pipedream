import onelogin from "../../onelogin.app.mjs";

export default {
  key: "onelogin-revoke-user-sessions",
  name: "Revoke User Sessions",
  description: "Revoke all active sessions for a specified user in OneLogin. [See the documentation](https://developers.onelogin.com/api-docs/2/users/update-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    onelogin,
    userId: {
      propDefinition: [
        onelogin,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.onelogin.updateUser({
      $,
      userId: this.userId,
      data: {
        status: 0,
      },
    });

    $.export("$summary", `Successfully revoked all sessions for user with ID: ${this.userId}`);
    return response;
  },
};
