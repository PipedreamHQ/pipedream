import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "linear_app-search-issues",
  name: "Search Issues",
  description: "Search Linear issues by team, project, assignee, labels, state, or text query. Returns up to 200 matching issues (paginated internally). Use **Get Teams** for team IDs, **List Projects** for project IDs, **List Workflow States** for state IDs, **List Users** for assignee IDs, and **List Labels** for label names. Use the optional `fields` prop to narrow the response to only the keys you need (reduces context size for large result sets). Example: `teamId: \"9d1c3f7e-...\", query: \"login redirect\"` → returns `[{id: \"iss_01\", identifier: \"ENG-42\", title: \"Fix login redirect on mobile\", state: {name: \"In Progress\"}}]`. [See the documentation](https://linear.app/developers/graphql).",
  type: "action",
  ai: "optimized",
  version: "1.0.0",
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
      optional: true,
      description: "Filter issues by team (a UUID, e.g. `9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f`). Leave this parameter out of the tool call entirely to search across all accessible teams — do not pass `\"*\"`, an empty string, or any other placeholder, since only a real team UUID or no value at all are valid. Use **Get Teams** to discover valid team IDs.",
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
      ],
      description: "Filter issues by their workflow state (status). States are scoped to the selected team.",
    },
    assigneeId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
    },
    issueLabelNames: {
      propDefinition: [
        linearApp,
        "issueLabelNames",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned issue object. When omitted, the full issue payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"identifier\", \"title\", \"state\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const issues = [];
    let hasNextPage;
    let after;

    // Some models pass a wildcard placeholder like "*" instead of omitting an
    // optional ID filter; treat anything that isn't a real team ID as "no filter".
    const teamId = this.teamId && this.teamId !== "*"
      ? this.teamId
      : undefined;

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
          teamId,
          projectId: this.projectId,
          assigneeId: this.assigneeId,
          issueLabels: this.issueLabelNames,
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

    return issues.map((issue) => utils.pickFields(issue, this.fields));
  },
};
