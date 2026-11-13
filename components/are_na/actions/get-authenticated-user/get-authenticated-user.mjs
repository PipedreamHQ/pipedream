import are_na from "../../are_na.app.mjs";

export default {
  key: "are_na-get-authenticated-user",
  name: "Get Authenticated User",
  description: "Returns the profile of the Are.na user the connection is authenticated as. Use this to find the current user's `id` or `slug` (for example to filter **Perform a Search** to their content with User ID); to find other users, use **List Users**. Takes no inputs. Example: returns `{ \"id\": 456, \"slug\": \"jane-doe\", \"name\": \"Jane Doe\" }` plus further profile fields. [See the documentation](https://www.are.na/developers/explore/user/me)",
  version: "0.0.4",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
