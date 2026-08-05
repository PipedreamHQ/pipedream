import linearApp from "../../linear_app.app.mjs";
import constants from "../../common/constants.mjs";
import fields from "../../common/fields.mjs";

// Documented Team fields, used to validate the `fields` prop.
const TEAM_FIELDS = [
  "archivedAt",
  "autoArchivePeriod",
  "autoClosePeriod",
  "autoCloseStateId",
  "color",
  "createdAt",
  "cycleCalenderUrl",
  "cycleCooldownTime",
  "cycleDuration",
  "cycleIssueAutoAssignCompleted",
  "cycleIssueAutoAssignStarted",
  "cycleLockToActive",
  "cycleStartDay",
  "cyclesEnabled",
  "defaultIssueEstimate",
  "description",
  "displayName",
  "groupIssueHistory",
  "icon",
  "id",
  "inheritIssueEstimation",
  "inheritWorkflowStatuses",
  "inviteHash",
  "issueCount",
  "key",
  "name",
  "private",
  "timezone",
  "triageEnabled",
  "updatedAt",
];

// Enough to pick a team and pass its id to a team-scoped action.
const COMPACT_FIELDS = [
  "id",
  "name",
  "key",
  "description",
];

export default {
  key: "linear_app-get-teams",
  name: "Get Teams",
  description: "Retrieves all teams in your Linear workspace. Returns array of team objects with details like ID, name, and key. Supports pagination with configurable limit. Uses API Key authentication. **Response size matters here:** by default every field of every team is returned — cycle configuration, auto-archive periods, invite hashes — which runs ~1.5 KB per team, so a workspace with a few dozen teams can overflow an AI agent's context window. Most callers want a team's `id` to pass to a team-scoped action: `fields: \"compact\"` returns just `id,name,key,description`. [See the documentation](https://linear.app/developers/graphql)",
  version: "0.3.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    linearApp,
    limit: {
      propDefinition: [
        linearApp,
        "limit",
      ],
      description: "Maximum number of teams to return. Defaults to 20 if not specified.",
    },
    fields: fields.fieldsProp({
      resource: "teams",
      compact: COMPACT_FIELDS,
      guidance: "Cycle settings (`cycleDuration`, `cycleCooldownTime`, `cycleStartDay`, …) and the auto-archive/auto-close periods are what make this response large; request them only when the question is about a team's configuration.",
    }),
  },
  async run({ $ }) {
    // Use the specified limit or default to a reasonable number
    const limit = this.limit || constants.DEFAULT_NO_QUERY_LIMIT;

    const variables = {
      first: limit,
    };

    const { nodes: teams } = await this.linearApp.listTeams(variables);

    const results = fields.projectRecords(teams, this.fields, {
      compact: COMPACT_FIELDS,
      known: TEAM_FIELDS,
    });

    $.export("$summary", `Found ${teams.length} teams(s)`);

    return results;
  },
};
