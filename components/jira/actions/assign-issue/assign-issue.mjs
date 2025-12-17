import jira from "../../jira.app.mjs";

export default {
  key: "jira-assign-issue",
  name: "Assign Issue",
  version: "0.0.14",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Assigns an issue to a user. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-assignee-put)",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    accountId: {
      propDefinition: [
        jira,
        "accountId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
  },
  async run({ $ }) {
    await this.jira.assignIssue({
      $,
      cloudId: this.cloudId,
      data: {
        accountId: this.accountId,
      },
      issueIdOrKey: this.issueIdOrKey,
    });
    $.export("$summary", "Successfully assigned issue");
  },
};
