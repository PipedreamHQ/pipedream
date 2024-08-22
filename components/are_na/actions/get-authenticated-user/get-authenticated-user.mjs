import are_na from "../../are_na.app.mjs";

export default {
  key: "are_na-get-authenticated-user",
  name: "Get Authenticated User",
  description: "Returns the currently authenticated user",
  version: "0.0.1",
  type: "action",
  props: {
    are_na,
  },
  async run({ $ }) {
    const response = await this.are_na.getAuthenticatedUser({
      $,
    });

    $.export("$summary", "Successfully retrieved user");
    return response;
  },
};
