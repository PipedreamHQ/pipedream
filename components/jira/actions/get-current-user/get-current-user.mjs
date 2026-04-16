import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated Jira user's account ID, display name, email, and active status. Call this first when the user says 'my issues', 'assigned to me', or needs their Jira identity. Use the returned `accountId` with **Search Issues with JQL** (e.g. `assignee = '{accountId}'`) or **Assign Issue**. Requires a Cloud ID to identify the Jira site. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-myself/#api-rest-api-3-myself-get).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
  },
  async run({ $ }) {
    const user = await this.jira._makeRequest({
      $,
      cloudId: this.cloudId,
      path: "/myself",
    });

    const summaryName = user.displayName || user.emailAddress || user.accountId;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return {
      accountId: user.accountId,
      displayName: user.displayName,
      emailAddress: user.emailAddress,
      active: user.active,
      timeZone: user.timeZone,
    };
  },
};
