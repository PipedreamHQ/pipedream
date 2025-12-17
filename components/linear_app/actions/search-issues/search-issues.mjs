import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "linear_app-search-issues",
  name: "Search Issues",
  description: "Searches Linear issues by team, project, assignee, labels, state, or text query. Supports pagination, ordering, and archived issues. Returns array of matching issues. Uses API Key authentication. See Linear docs for additional info [here](https://linear.app/developers/graphql).",
  type: "action",
  version: "0.2.15",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
    },
    query: {
      propDefinition: [
        linearApp,
        "query",
      ],
      optional: true,
    },
    stateId: {
      propDefinition: [
        linearApp,
        "stateId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
      description: "Filter issues by their workflow state (status). States are scoped to the selected team.",
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
    limit: {
      propDefinition: [
        linearApp,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const issues = [];
    let hasNextPage;
    let after;

    // Determine the overall max limit for all pages combined
    const maxLimit = this.limit || (this.query
      ? constants.DEFAULT_MAX_RECORDS
      : constants.DEFAULT_NO_QUERY_LIMIT);

    // For pagination, we'll use a smaller page size
    const pageSize = Math.min(maxLimit, constants.DEFAULT_LIMIT);

    do {
      // If we've already reached our limit, stop fetching more data
      if (issues.length >= maxLimit) {
        break;
      }

      // Calculate how many more items we need for this page
      const remainingNeeded = maxLimit - issues.length;
      const thisPageLimit = Math.min(pageSize, remainingNeeded);

      const variables = utils.buildVariables(after, {
        filter: {
          query: this.query,
          teamId: this.teamId,
          projectId: this.projectId,
          assigneeId: this.assigneeId,
          issueLabels: this.issueLabels,
          state: this.stateId
            ? {
              id: {
                eq: this.stateId,
              },
            }
            : undefined,
        },
        orderBy: this.orderBy,
        includeArchived: this.includeArchived,
        limit: thisPageLimit, // Use calculated limit for this page
      });

      const {
        nodes,
        pageInfo,
      } = await this.linearApp.listIssues(variables);

      issues.push(...nodes);
      after = pageInfo.endCursor;
      hasNextPage = pageInfo.hasNextPage;
    } while (hasNextPage && issues.length < maxLimit);

    $.export("$summary", `Found ${issues.length} issues`);

    return issues;
  },
};
