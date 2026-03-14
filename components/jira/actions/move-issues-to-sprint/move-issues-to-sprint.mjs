import utils from "../../common/utils.mjs";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-move-issues-to-sprint",
  name: "Move Issues to Sprint",
  description: "Moves issues to a sprint, for a given sprint ID. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-sprint/#api-rest-agile-1-0-sprint-sprintid-issue-post)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    jira,
    boardId: {
      propDefinition: [
        jira,
        "boardId",
      ],
    },
    sprintId: {
      propDefinition: [
        jira,
        "sprintId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
    },
    issues: {
      type: "string[]",
      label: "Issues",
      description: "The IDs or keys of the issues to move to the sprint.",
      propDefinition: [
        jira,
        "issueIdOrKey",
      ],
    },
  },
  async run({ $ }) {
    const issues = utils.parseArray(this.issues);
    await this.jira.moveIssuesToSprint({
      $,
      sprintId: this.sprintId,
      data: {
        issues,
      },
    });
    $.export("$summary", "Successfully moved issues to sprint.");
    return {
      success: true,
    };
  },
};
