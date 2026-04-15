import app from "../../apollo_io_oauth.app.mjs";

export default {
  key: "apollo_io_oauth-get-current-user",
  name: "Get Current User",
  description:
    "Returns the authenticated user's profile including their ID,"
    + " name, email, and team information."
    + " Use this tool first to identify the current user's ID for"
    + " filtering records by owner in **Search Contacts** or"
    + " **Search Accounts**."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/get-authenticated-user)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const { users } = await this.app.listUsers({
      $,
    });
    const currentUser = users?.[0];
    $.export(
      "$summary",
      currentUser
        ? `Authenticated as ${currentUser.name} (${currentUser.email})`
        : "No user found",
    );
    return currentUser;
  },
};
