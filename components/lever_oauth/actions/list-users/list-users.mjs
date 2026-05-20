import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-list-users",
  name: "List Users",
  description:
    "Returns all users (recruiters, hiring managers, admins) in the Lever account."
    + " Use this to resolve team member names to user IDs before assigning ownership, filtering opportunities by owner, or setting the Perform As field on write operations."
    + " Returns each user's id, name, email, and access role."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-users)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Maximum number of users to return (1–100). Defaults to 100.",
    },
  },
  async run({ $ }) {
    const response = await this.app.listUsers({
      $,
      params: {
        limit: this.limit,
      },
    });
    const users = response.data ?? response;
    $.export("$summary", `Retrieved ${users.length} user${users.length === 1
      ? ""
      : "s"}`);
    return users;
  },
};
