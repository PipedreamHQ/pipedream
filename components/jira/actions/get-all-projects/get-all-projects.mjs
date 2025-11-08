import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-all-projects",
  name: "Get All Projects",
  description: "Gets metadata on all projects. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-project-get)",
  version: "0.1.16",
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
    recent: {
      type: "integer",
      label: "Recent Projects",
      description: "Returns the user's most recently accessed projects. You may specify the number of results to return up to a maximum of 20. If access is anonymous, then the recently accessed projects are based on the current HTTP session.",
      optional: true,
    },
    properties: {
      propDefinition: [
        jira,
        "properties",
      ],
      description: "Details of issue properties to be added or updated. Please provide an array of objects with keys and values.",
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
      description: "Use expand to include additional information in the response. This parameter accepts a comma-separated list. Expanded options include:\n`description` Returns the project description.\n`issueTypes` Returns all issue types associated with the project.\n`lead` Returns information about the project lead.\n`projectKeys` Returns all project keys associated with the project.",
    },
  },
  async run({ $ }) {
    let properties;
    try {
      properties = JSON.parse(this.properties);
    } catch ( err ) {
      //pass
    }
    const projects = [];
    const resourcesStream = await this.jira.getResourcesStream({
      cloudId: this.cloudId,
      resourceFn: this.jira.getAllProjects,
      resourceFnArgs: {
        $,
        issueIdOrKey: this.issueIdOrKey,
        params: {
          recent: this.recent,
          properties,
          expand: this.expand,
        },
      },
      resourceFiltererFn: (resource) => resource.values,
    });
    for await (const project of resourcesStream) {
      projects.push(project);
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${projects.length} ${projects.length === 1 ? "project" : "projects"}`);
    return projects;
  },
};
