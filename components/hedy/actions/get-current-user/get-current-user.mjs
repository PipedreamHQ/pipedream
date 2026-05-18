import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-current-user",
  name: "Get Current User",
  description: "Retrieves the account details for the authenticated Hedy user, including email, display name, and plan information."
    + " Use this tool first to establish identity — the returned user ID anchors queries like 'my sessions' or 'my topics'."
    + " [See the documentation](https://www.hedy.ai/help/hedy-api/)",
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
    const response = await this.app.getCurrentUser({
      $,
    });
    const user = response?.data || response;
    $.export("$summary", `Retrieved account details for ${user?.email || user?.name || "user"}`);
    return response;
  },
};
