import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-search-issues",
  name: "Search Issues",
  description: "Search issues (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  type: "action",
  version: "0.2.4",
  props: {
    linearApp,
    query: {
      propDefinition: [
        linearApp,
        "query",
      ],
    },
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
    },
    assigneeId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
    },
    issueLabels: {
      propDefinition: [
        linearApp,
        "issueLabels",
      ],
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
    includeArchived: {
      propDefinition: [
        linearApp,
        "includeArchived",
      ],
    },
  },
  async run({ $ }) {
    const issues = [];
    let hasNextPage;
    let after;

    do {
      const variables = utils.buildVariables(after, {
        filter: {
          query: this.query,
          teamId: this.teamId,
          projectId: this.projectId,
          assigneeId: this.assigneeId,
          issueLabels: this.issueLabels,
        },
        orderBy: this.orderBy,
        includeArchived: this.includeArchived,
      });
      const {
        nodes,
        pageInfo,
      } = await this.linearApp.listIssues(variables);

      issues.push(...nodes);
      after = pageInfo.endCursor;
      hasNextPage = pageInfo.hasNextPage;
    } while (hasNextPage);

    $.export("$summary", `Found ${issues.length} issues`);

    return issues;
  },
};
