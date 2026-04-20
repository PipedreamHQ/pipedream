import jira from "../../jira.app.mjs";

export default {
  key: "jira-list-boards",
  name: "List Boards",
  description: "Returns all boards. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-rest-agile-1-0-board-get)",
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
    startAt: {
      type: "integer",
      label: "Start At",
      description: "The starting index of the returned boards. Base index: 0.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of boards to return.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Filters results to boards of the specified type.",
      optional: true,
      options: [
        "scrum",
        "kanban",
        "simple",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filters results to boards that match or partially match the specified name.",
      optional: true,
    },
    projectKeyOrId: {
      type: "string",
      label: "Project Key or ID",
      description: "Filters results to boards that are relevant to a project.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jira.listBoards({
      $,
      cloudId: this.cloudId,
      params: {
        startAt: this.startAt,
        maxResults: this.maxResults,
        type: this.type,
        name: this.name,
        projectKeyOrId: this.projectKeyOrId,
      },
    });
    const count = response?.values?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} board${count !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
