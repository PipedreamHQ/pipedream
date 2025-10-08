import app from "../../gorillastack.app.mjs";

export default {
  key: "gorillastack-invite-user",
  name: "Invite User",
  description: "Invite new user to GorillaStack. [See the documentation](https://docs.gorillastack.com/swagger/v2#/users/post_teams__teamId__users_invite)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email of the user to invite",
    },
    role: {
      type: "string",
      label: "Role",
      description: "Role of the user to invite",
      options: [
        "guest",
        "member",
        "admin",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.inviteUser({
      $,
      data: {
        email: this.email,
        role: this.role,
      },
    });
    $.export("$summary", `Successfully invited "${this.email}" to GorillaStack`);
    return response;
  },
};
