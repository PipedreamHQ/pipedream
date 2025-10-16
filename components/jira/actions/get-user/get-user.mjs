import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-user",
  name: "Get User",
  description: "Gets details of user, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-users/#api-rest-api-3-user-get)",
  version: "0.1.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
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
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
      description: "Use expand to include additional information about users in the response. This parameter accepts a comma-separated list. Expand options include:\n*`groups` includes all groups and nested groups to which the user belongs.\n*`applicationRoles` includes details of all the applications to which the user has access.",
    },
  },
  async run({ $ }) {
    const response = await this.jira.getUser({
      $,
      cloudId: this.cloudId,
      params: {
        accountId: this.accountId,
        expand: this.expand,
      },
    });
    $.export("$summary", `Successfully retrieved the user with account ID: ${this.accountId}`);
    return response;
  },
};
