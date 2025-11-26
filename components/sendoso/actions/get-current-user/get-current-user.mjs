import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-current-user",
  name: "Get Current User",
  description: "Get information about the current user. [See the documentation](https://developer.sendoso.com/rest-api/reference/users/get-current-user)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sendoso,
  },
  async run({ $ }) {
    const response = await this.sendoso.getCurrentUser({
      $,
    });
    $.export("$summary", `Successfully retrieved current user information for ${response.email || "user"}`);
    return response;
  },
};
