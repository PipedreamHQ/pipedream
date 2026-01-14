import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "List Boards",
  key: "jira_data_center-list-boards",
  description: "Retrieves a list of boards. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-board/#api-agile-1-0-board-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jiraDataCenter,
    projectId: {
      propDefinition: [
        jiraDataCenter,
        "projectId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter by name",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Filter by type",
      optional: true,
      options: [
        "kanban",
        "scrum",
      ],
    },
    maxResults: {
      propDefinition: [
        jiraDataCenter,
        "maxResults",
      ],
    },
    startAt: {
      propDefinition: [
        jiraDataCenter,
        "startAt",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jiraDataCenter.listBoards({
      $,
      params: {
        projectKeyOrId: this.projectId,
        name: this.name,
        type: this.type,
        maxResults: this.maxResults,
        startAt: this.startAt,
      },
    });

    $.export("$summary", `Successfully got ${response.values?.length || 0} board${response.values?.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
