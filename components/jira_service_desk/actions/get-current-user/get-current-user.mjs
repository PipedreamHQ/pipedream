import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-get-current-user",
  name: "Get Current User",
  description:
    "Returns the authenticated user's `account_id`, `display_name`, and `email` from Atlassian."
    + " Use this to identify who is logged in, or to filter requests by the current user's `account_id`."
    + " No `cloudId` required — this uses the Atlassian Identity API directly."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/)",
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
    const user = await this.app.getCurrentUser({
      $,
    });
    $.export("$summary", `Current user: ${user.display_name || user.displayName} (${user.email || user.emailAddress})`);
    return user;
  },
};
