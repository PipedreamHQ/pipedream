import arena from "../../arena.app.mjs";

export default {
  key: "arena-get-authenticated-user",
  name: "Get Authenticated User",
  description: "Returns the currently authenticated user",
  version: "0.0.1",
  type: "action",
  props: {
    arena,
  },
  async run({ $ }) {
    const response = await this.arena.getAuthenticatedUser({
      $,
    });

    $.export("$summary", "Successfully retrieved user");
    return response;
  },
};
