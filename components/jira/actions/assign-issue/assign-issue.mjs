import jira from "../../jira.app.mjs";

export default {
  key: "jira-assign-issue",
  name: "Assign Issue",
  version: "0.0.3",
  description: "Assigns an issue to a user. [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-assignee-put)",
  type: "action",
  props: {
    jira,
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
      ],
    },
    accountId: {
      propDefinition: [
        jira,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    await this.jira.assignIssue({
      $,
      data: {
        accountId: this.accountId,
      },
      issueIdOrKey: this.issueIdOrKey,
    });
    $.export("$summary", "Successfully assigned issue");
  },
};
