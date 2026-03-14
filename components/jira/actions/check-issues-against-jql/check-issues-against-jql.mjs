import app from "../../jira.app.mjs";

export default {
  key: "jira-check-issues-against-jql",
  name: "Check Issues Against JQL",
  description: "Checks whether one or more issues would be returned by one or more JQL queries. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-jql-match-post)",
  version: "0.0.4",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    issueIds: {
      type: "string[]",
      label: "Issue IDs",
      description: "A list of issue IDs to check against the JQL queries. Example: `[\"10001\", \"10042\"]`",
      propDefinition: [
        app,
        "issueIdOrKey",
      ],
    },
    jqls: {
      type: "string[]",
      label: "JQL Queries",
      description: "A list of JQL query strings to check the issues against. Example: `[\"project = FOO\", \"issuetype = Bug\"]`",
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
      issueIds,
      jqls,
    } = this;

    const response = await app.checkIssuesAgainstJQL({
      $,
      data: {
        issueIds: issueIds.map((id) => parseInt(id)),
        jqls,
      },
    });

    const totalMatches = response.matches?.reduce(
      (sum, match) => sum + (match.matchedIssues?.length || 0),
      0,
    ) || 0;
    $.export("$summary", `Successfully checked ${issueIds.length} issue(s) against ${jqls.length} JQL quer${jqls.length === 1
      ? "y"
      : "ies"}. Found ${totalMatches} total match${totalMatches === 1
      ? ""
      : "es"}`);
    return response;
  },
};
