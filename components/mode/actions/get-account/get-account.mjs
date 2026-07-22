import app from "../../mode.app.mjs";

export default {
  key: "mode-get-account",
  name: "Get Account",
  description: "Retrieve the Mode workspace/account object (username, name, id, token, plan) for the connected organization. Call this to confirm the authenticated organization and inspect its plan and counts. [See the documentation](https://mode.com/developer/api-reference/management/users/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getAccount({
      $,
    });
    $.export("$summary", `Successfully retrieved account for organization "${response?.username}"`);
    return response;
  },
};
