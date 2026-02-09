import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-users",
  name: "Get Users",
  description: "Gets the details for a list of users. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-user-search/#api-rest-api-3-user-search-get)",
  version: "0.0.12",
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
    query: {
      label: "Query",
      description: "Filter for a name or term",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jira.findUsers({
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
