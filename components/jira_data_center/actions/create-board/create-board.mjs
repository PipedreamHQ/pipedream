import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "Create Board",
  description: "Creates a new board. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-board/#api-agile-1-0-board-post)",
  key: "jira_data_center-create-board",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    jiraDataCenter,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the board",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the board",
      options: [
        "kanban",
        "scrum",
      ],
    },
    filterId: {
      propDefinition: [
        jiraDataCenter,
        "filterId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jiraDataCenter.createBoard({
      $,
      data: {
        name: this.name,
        type: this.type,
        filterId: this.filterId,
      },
    });
    $.export("$summary", `Successfully created board with ID \`${response.id}\``);
    return response;
  },
};
