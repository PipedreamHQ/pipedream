import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-users",
  name: "Get Users",
  description: "Gets the details for a list of users. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-user-search/#api-rest-api-3-user-search-get)",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jira,
    query: {
      label: "Query",
      description: "Filter for a name or term",
      type: "string",
      optional: true,
    },
  },
  /**
   * Runs the action and returns matching users.
   * @param {object} $ - The Pipedream step context
   * @returns {Promise<Array>} Array of user objects
   */
  async run({ $ }) {
    const response = await this.jira.findUsers({
      $,
      params: {
        query: this.query,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.length} users`);

    return response;
  },
};
