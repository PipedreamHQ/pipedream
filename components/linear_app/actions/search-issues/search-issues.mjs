import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";
import fields from "../../common/fields.mjs";
import fieldSets from "../../common/field-sets.mjs";

// How many issues a keyword search accumulates across pages when the caller sets no
// explicit `limit`. Deliberately local rather than `constants.DEFAULT_MAX_RECORDS`
// (200): that constant is shared with the app's generic paginate helper that the event
// sources rely on, and a trigger sweeping 200 records is fine — a tool result carrying
// 200 full-width issues is not.
//
// 25 is measured, not guessed. A full-width Issue runs ~3.0 KB (description body plus
// nested team/project/cycle/parent), so 200 was ~600 KB and even 50 came to 150 KB —
// roughly 37k tokens, past the 25k ceiling where Claude Code spills the result to a
// file and the model answers from data it never received. 25 lands near 75 KB (~19k
// tokens), under the ceiling with headroom. `pageInfo` still reports more pages, so
// this bounds the response without hiding that a wider result set exists.
const DEFAULT_QUERY_LIMIT = 25;

export default {
  key: "linear_app-search-issues",
  name: "Search Issues",
  description: "Searches Linear issues by team, project, assignee, labels, state, or text query. Supports pagination, ordering, and archived issues. Returns array of matching issues. Uses API Key authentication. **Response size matters here:** by default every field of every matching issue is returned, including the full `description` body and nested `team`, `project`, `cycle` and `parent` objects — measured at 20-34 KB for a single search on a real workspace, enough to exceed an AI agent's tool-output ceiling. `fields: \"compact\"` returns `id,identifier,title,state,assignee,priorityLabel`, which answers most \"find the issue about X\" questions; fetch the body with **Get Issue** once you know which one you want. [See the documentation](https://linear.app/developers/graphql)",
  type: "action",
  version: "0.7.0",
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
      // Optional, matching List Workflow States. When it was required, an agent asked
      // "find the issue about X" with no team named had no choice but to call Get Teams
      // and then re-run this search once per team — measured brute-forcing four teams
      // in a row and still missing the issue. Relaxing a requirement can't break an
      // existing caller; omitting it searches every team the credential can see.
      optional: true,
      description: "Restrict the search to one team. **Omit it to search every team the account can see** — do that when the user names an issue but not a team, rather than calling **Get Teams** and searching each team in turn. When you omit it, ALWAYS pass `fields: \"compact\"` as well: a workspace-wide search can match many issues, and at full width that exceeds what an AI agent can receive in one tool result.",
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
      description: "Maximum issues to return across all pages. Defaults to 25 when a `query` is given and 20 when it is not. Raise it only when you genuinely need more, and pair a raised limit with `fields: \"compact\"` — full-width issues in the hundreds will not fit in an AI agent's tool result.",
    },
    fields: fields.fieldsProp({
      resource: "issues",
      compact: fieldSets.issue.compact,
      guidance: fieldSets.issue.guidance,
    }),
  },
  async run({ $ }) {
    const issues = [];
    let hasNextPage;
    let after;

    // Determine the overall max limit for all pages combined
    const maxLimit = this.limit || (this.query
      ? DEFAULT_QUERY_LIMIT
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
      compact: fieldSets.issue.compact,
      known: fieldSets.issue.known,
    });
  },
};
