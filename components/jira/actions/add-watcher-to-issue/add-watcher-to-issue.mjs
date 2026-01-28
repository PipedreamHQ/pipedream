import jira from "../../jira.app.mjs";

export default {
  key: "jira-add-watcher-to-issue",
  name: "Add Watcher To Issue",
  version: "0.0.16",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Adds a user as a watcher of an issue by passing the account ID of the user, For example, `5b10ac8d82e05b22cc7d4ef5`, If no user is specified the calling user is added. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-watchers/#api-rest-api-3-issue-issueidorkey-watchers-post)",
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
    await this.jira.addWatcher({
      $,
      cloudId: this.cloudId,
      accountId: this.accountId,
      issueIdOrKey: this.issueIdOrKey,
    });
    $.export("$summary", `Successfully added watcher to issue with ID(or key): ${this.issueIdOrKey}`);
  },
};
