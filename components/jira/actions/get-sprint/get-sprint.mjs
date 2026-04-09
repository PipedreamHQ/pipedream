import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-sprint",
  name: "Get Sprint",
  description: "Returns the sprint for a given sprint ID. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-sprint/#api-rest-agile-1-0-sprint-sprintid-get)",
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
  },
  async run({ $ }) {
    const response = await this.jira.getSprint({
      $,
      cloudId: this.cloudId,
      sprintId: this.sprintId,
    });
    $.export("$summary", `Successfully retrieved sprint with ID ${this.sprintId}`);
    return response;
  },
};
