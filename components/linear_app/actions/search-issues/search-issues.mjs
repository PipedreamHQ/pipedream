import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";
import fields from "../../common/fields.mjs";

// Documented Issue fields (the `issue` GraphQL fragment), used to validate `fields`.
const ISSUE_FIELDS = [
  "archivedAt",
  "assignee",
  "autoArchivedAt",
  "autoClosedAt",
  "botActor",
  "branchName",
  "canceledAt",
  "completedAt",
  "createdAt",
  "creator",
  "customerTicketCount",
  "cycle",
  "description",
  "dueDate",
  "estimate",
  "favorite",
  "id",
  "identifier",
  "labelIds",
  "lastAppliedTemplate",
  "number",
  "parent",
  "previousIdentifiers",
  "priority",
  "priorityLabel",
  "project",
  "projectMilestone",
  "snoozedBy",
  "snoozedUntilAt",
  "sortOrder",
  "startedAt",
  "startedTriageAt",
  "state",
  "subIssueSortOrder",
  "team",
  "title",
  "trashed",
  "triagedAt",
  "updatedAt",
  "url",
];

// Enough to identify an issue, report its status, and act on it afterwards.
const COMPACT_FIELDS = [
  "id",
  "identifier",
  "title",
  "state",
  "assignee",
  "priorityLabel",
];

export default {
  key: "linear_app-search-issues",
  name: "Search Issues",
  description: "Searches Linear issues by team, project, assignee, labels, state, or text query. Supports pagination, ordering, and archived issues. Returns array of matching issues. Uses API Key authentication. **Response size matters here:** by default every field of every matching issue is returned, including the full `description` body and nested `team`, `project`, `cycle` and `parent` objects — measured at 20-34 KB for a single search on a real workspace, enough to exceed an AI agent's tool-output ceiling. `fields: \"compact\"` returns `id,identifier,title,state,assignee,priorityLabel`, which answers most \"find the issue about X\" questions; fetch the body with **Get Issue** once you know which one you want. See Linear docs for additional info [here](https://linear.app/developers/graphql).",
  type: "action",
  version: "0.3.0",
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
    fields: fields.fieldsProp({
      resource: "issues",
      compact: COMPACT_FIELDS,
      guidance: "`description` (the issue body) and the nested `team`, `project`, `cycle` and `parent` objects are what make this response large; request them only when you need more than the issue's identity and status.",
    }),
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

    return fields.projectRecords(issues, this.fields, {
      compact: COMPACT_FIELDS,
      known: ISSUE_FIELDS,
    });
  },
};
