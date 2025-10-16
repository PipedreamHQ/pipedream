import smugmug from "../../smugmug.app.mjs";

export default {
  key: "smugmug-get-authenticated-user",
  name: "Get Authenticated User",
  description: "Gets details of the authenticated user. [See the docs here](https://api.smugmug.com/api/v2/doc/reference/user.html)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    smugmug,
  },
  async run({ $ }) {
    const response = await this.smugmug.getAuthenticatedUser({
      $,
    });
    if (response) {
      $.export("$summary", `Retrieved authenticated user ${response.Response.User.Name}`);
    }
    return response;
  },
};
