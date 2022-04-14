import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-all-projects",
  name: "JIRA - Get All Projects",
  description: "Gets metadata on all projects, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-project-get)",
  version: "0.1.2",
  type: "action",
  props: {
    jira,
    recent: {
      type: "integer",
      label: "Recent",
      description: "Returns the user's most recently accessed projects. You may specify the number of results to return up to a maximum of 20. If access is anonymous, then the recently accessed projects are based on the current HTTP session.",
      optional: true,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "Details of issue properties to be add or update, please provide an array of objects with keys and values.",
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Use expand to include additional information in the response. This parameter accepts a comma-separated list. Expanded options include:\n`description` Returns the project description.\n`issueTypes` Returns all issue types associated with the project.\n`lead` Returns information about the project lead.\n`projectKeys` Returns all project keys associated with the project.",
      optional: true,
    },
  },
  async run({ $ }) {
    const properties = this.properties ?
      JSON.parse(this.properties) :
      undefined;
    const response = await this.jira.getAllProjects({
      $,
      params: {
        recent: this.recent,
        properties,
        expand: this.expand,
      },
    });
    $.export("$summary", "All projects have been retrieved.");
    return response;
  },
};
