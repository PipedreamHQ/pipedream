import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-users",
  name: "Get Users",
  description: "Gets details of a list of users. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-users/#api-rest-api-3-users-search-get)",
  version: "0.0.1",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    query: {
      label: "Query",
      description: "Filter for a name or term",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jira.getUsers({
      $,
      cloudId: this.cloudId,
      params: {
        query: this.query,
      },
    });

    $.export("$summary", `Successfully retrieved users from cloud ID ${this.cloudId}`);

    return response;
  },
};
