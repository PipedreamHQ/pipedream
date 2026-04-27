import jira from "../../jira.app.mjs";

export default {
  key: "jira-list-sprint-issues",
  name: "List Sprint Issues",
  description: "Returns all issues in a sprint. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-sprint/#api-rest-agile-1-0-sprint-sprintid-issue-get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    boardId: {
      propDefinition: [
        jira,
        "boardId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    sprintId: {
      propDefinition: [
        jira,
        "sprintId",
        (c) => ({
          cloudId: c.cloudId,
          boardId: c.boardId,
        }),
      ],
    },
    startAt: {
      type: "integer",
      label: "Start At",
      description: "The starting index of the returned issues. Base index: 0.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of issues to return.",
      optional: true,
    },
    jql: {
      type: "string",
      label: "JQL",
      description: "Filters results using a JQL query.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "A list of fields to return for each issue. Accepts a comma-separated list.",
      optional: true,
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jira.listSprintIssues({
      $,
      cloudId: this.cloudId,
      sprintId: this.sprintId,
      params: {
        startAt: this.startAt,
        maxResults: this.maxResults,
        jql: this.jql,
        fields: this.fields,
        expand: this.expand,
      },
    });
    let baseUrl;
    try {
      baseUrl = await this.jira.getCloudBaseUrl(this.cloudId);
    } catch (e) {
      console.log("Could not enrich response with browser URL", e.message);
    }
    const issues = baseUrl && response.issues
      ? response.issues.map((issue) => ({
        ...issue,
        browserUrl: issue.key
          ? `${baseUrl}/browse/${issue.key}`
          : undefined,
      }))
      : response.issues;

    const count = response?.issues?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} issue${count !== 1
      ? "s"
      : ""} from sprint ${this.sprintId}`);
    return {
      ...response,
      issues,
    };
  },
};
