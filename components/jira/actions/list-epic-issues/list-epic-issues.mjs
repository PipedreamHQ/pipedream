import { ConfigurationError } from "@pipedream/platform";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-list-epic-issues",
  name: "List Epic Issues",
  description: "Returns all issues that belong to an epic on the given board. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-rest-agile-1-0-board-boardid-epic-epicid-issue-get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    jira,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "warning",
      content: "This action only works with **classic (company-managed)** Jira Software boards. If your board uses a **next-gen (team-managed)** project, use the **Search Issues with JQL** action with a filter like `parent = EPIC-KEY` instead.",
    },
    boardId: {
      propDefinition: [
        jira,
        "boardId",
      ],
    },
    epicId: {
      propDefinition: [
        jira,
        "epicId",
        (c) => ({
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
    let response;
    try {
      response = await this.jira.listEpicIssues({
        $,
        boardId: this.boardId,
        epicId: this.epicId,
        params: {
          startAt: this.startAt,
          maxResults: this.maxResults,
          jql: this.jql,
          fields: this.fields,
          expand: this.expand,
        },
      });
    } catch (err) {
      const is400 = err?.status === 400 || err?.response?.status === 400;
      const isNextGen = JSON.stringify(err?.response?.data ?? err?.message ?? "").includes("next-gen");
      if (is400 && isNextGen) {
        throw new ConfigurationError("This board uses next-gen (team-managed) projects, which are not supported by this endpoint. To list issues under an epic for a next-gen board, use the **Search Issues with JQL** action with a filter like `parent = EPIC-KEY` instead.");
      }
      throw err;
    }
    const count = response?.issues?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} issue${count !== 1
      ? "s"
      : ""} from epic ${this.epicId}`);
    return response;
  },
};
