import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-current-user",
  name: "Get Current User",
  description: "Retrieve profile information for the authenticated Jira user via the `/myself` endpoint. Returns account ID, display name, email address, and active status. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-myself/#api-rest-api-3-myself-get).",
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
      accountType: user.accountType,
      avatarUrls: user.avatarUrls,
      timeZone: user.timeZone,
      locale: user.locale,
    };
  },
};
