import app from "../../jira.app.mjs";

export default {
  key: "jira-count-issues-using-jql",
  name: "Count Issues Using JQL",
  description: "Provide an estimated count of the issues that match the JQL. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-approximate-count-post)",
  version: "0.0.4",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    jql: {
      type: "string",
      label: "JQL Query",
      description: "The JQL query to count issues. The JQL must be bounded. Example: `project = HSP`",
    },
  },
  /**
   * Runs the action and returns the API response.
   * @param {object} $ - The Pipedream step context
   * @returns {Promise<object>} The API response
   */
  async run({ $ }) {
    const {
      app,
      jql,
    } = this;

    const response = await app.countIssuesUsingJQL({
      $,
      data: {
        jql,
      },
    });

    $.export("$summary", `Successfully counted approximately ${response.count || 0} issue(s) matching the JQL query`);
    return response;
  },
};
