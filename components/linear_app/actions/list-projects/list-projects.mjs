import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";
import fields from "../../common/fields.mjs";

// Documented Project fields (the `project` GraphQL fragment), used to validate `fields`.
const PROJECT_FIELDS = [
  "color",
  "completedIssueCountHistory",
  "completedScopeHistory",
  "createdAt",
  "creator",
  "description",
  "id",
  "inProgressScopeHistory",
  "issueCountHistory",
  "lead",
  "name",
  "priority",
  "progress",
  "scope",
  "scopeHistory",
  "slackIssueComments",
  "slackIssueStatuses",
  "slackNewIssue",
  "slugId",
  "sortOrder",
  "state",
  "status",
  "updatedAt",
  "url",
];

// Enough to answer "what projects are there and how are they doing".
const COMPACT_FIELDS = [
  "id",
  "name",
  "description",
  "state",
  "status",
  "progress",
];

export default {
  key: "linear_app-list-projects",
  name: "List Projects",
  description: "List projects in Linear. **Response size matters here:** by default every field of every project is returned, including five per-project time-series arrays (`issueCountHistory`, `scopeHistory`, `completedScopeHistory`, `completedIssueCountHistory`, `inProgressScopeHistory`) that dominate the payload — measured at ~1 KB per project, so even a handful of projects can crowd out an AI agent's context. `fields: \"compact\"` returns `id,name,description,state,status,progress`, which is what a question about projects normally needs. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectConnection?query=projects).",
  type: "action",
  version: "0.1.0",
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
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
    first: {
      type: "integer",
      label: "First",
      description: "The number of projects to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of projects",
      optional: true,
    },
    fields: fields.fieldsProp({
      resource: "projects",
      compact: COMPACT_FIELDS,
      guidance: "The `*History` arrays (`issueCountHistory`, `scopeHistory`, `completedScopeHistory`, `completedIssueCountHistory`, `inProgressScopeHistory`) are the bulk of the response — request them only when charting a project's progress over time.",
    }),
  },
  async run({ $ }) {
    const variables = utils.buildVariables(this.after, {
      filter: {
        accessibleTeams: {
          id: {
            eq: this.teamId,
          },
        },
      },
      orderBy: this.orderBy,
      limit: this.first,
    });

    const {
      nodes, pageInfo,
    } = await this.linearApp.listProjects(variables);

    $.export("$summary", `Found ${nodes.length} projects`);

    return {
      nodes: fields.projectRecords(nodes, this.fields, {
        compact: COMPACT_FIELDS,
        known: PROJECT_FIELDS,
      }),
      pageInfo,
    };
  },
};
