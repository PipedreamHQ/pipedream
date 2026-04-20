import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-issue-types",
  name: "Get Issue Types",
  description: "Gets the available issue types. If a project ID is provided, returns issue types for that project. Otherwise, returns all issue types accessible to the user. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-types/#api-rest-api-3-issuetype-get)",
  version: "0.0.3",
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
    projectId: {
      propDefinition: [
        jira,
        "projectID",
        ({ cloudId }) => ({
          cloudId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.projectId
      ? await this.jira.getProjectIssueTypes({
        $,
        cloudId: this.cloudId,
        params: {
          projectId: this.projectId,
        },
      })
      : await this.jira.getUserIssueTypes({
        $,
        cloudId: this.cloudId,
      });

    const summary = this.projectId
      ? `Successfully retrieved ${response.length} issue type(s) for project ${this.projectId}`
      : `Successfully retrieved ${response.length} issue type(s)`;

    $.export("$summary", summary);

    return response;
  },
};
