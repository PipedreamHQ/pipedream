import brexApp from "../../brex.app.mjs";

export default {
  key: "brex-get-user",
  name: "Get User",
  description: "Retrieves one person in the Brex account, including their status, manager, department, location, and title. Use **List Users** to find a user ID by email address. [See the documentation](https://developer.brex.com/openapi/team_api/users/getuserbyid)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    userId: {
      propDefinition: [
        brexApp,
        "user",
      ],
      description: "The person to retrieve.",
      optional: false,
    },
  },
  async run({ $ }) {
    const user = await this.brexApp.getUser({
      $,
      userId: this.userId,
    });

    $.export(
      "$summary",
      `Retrieved ${user.first_name} ${user.last_name} <${user.email}> — ${user.status}`,
    );

    return user;
  },
};
