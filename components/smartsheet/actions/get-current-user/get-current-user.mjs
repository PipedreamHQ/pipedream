import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-get-current-user",
  name: "Get Current User",
  description:
    "Get the authenticated user's identity — returns user ID, email, first/last name, and account details."
    + " Use this when the user says 'my sheets' or 'my account' to identify the owner."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/users/get-current-user)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
  },
  async run({ $ }) {
    const response = await this.smartsheet.getCurrentUser({
      $,
    });
    $.export("$summary", `Authenticated as ${response.email}`);
    return response;
  },
};
