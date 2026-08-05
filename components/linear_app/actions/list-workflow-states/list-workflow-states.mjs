import linearApp from "../../linear_app.app.mjs";
import fields from "../../common/fields.mjs";

// Documented WorkflowState fields, used to validate `fields`.
const STATE_FIELDS = [
  "archivedAt",
  "color",
  "createdAt",
  "description",
  "id",
  "inheritedFrom",
  "name",
  "position",
  "team",
  "type",
  "updatedAt",
];

// Enough to name a status and pass its id to Update Issue.
const COMPACT_FIELDS = [
  "id",
  "name",
  "type",
];

export default {
  key: "linear_app-list-workflow-states",
  name: "List Workflow States",
  description: "List workflow states (statuses) in Linear. Returns state IDs, names, types (e.g. backlog, started, completed, cancelled), and team info. Optionally filter by team (use the **Get Teams** action to discover valid team IDs, e.g. `4e80f53c-da9e-4dee-b14e-2cab3e2e8716`). **Response size matters here:** every state carries a nested `team` object, so an unfiltered call returns states × teams and grows with the size of the workspace — measured at 22 KB on a real one. Filter by `teamId` when you know the team, and pass `fields: \"compact\"` (`id,name,type`) when you just need a state id to move an issue to. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=workflowStates).",
  version: "0.2.0",
  type: "action",
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
      description: "Optional team to filter workflow states by. If omitted, returns states across all teams the API key has access to. Use the **Get Teams** action to discover valid team IDs (UUID format, e.g. `4e80f53c-da9e-4dee-b14e-2cab3e2e8716`).",
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
      description: "The number of workflow states to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of workflow states",
      optional: true,
    },
    includeArchived: {
      propDefinition: [
        linearApp,
        "includeArchived",
      ],
    },
    fields: fields.fieldsProp({
      resource: "workflow states",
      compact: COMPACT_FIELDS,
      guidance: "The nested `team` object is repeated on every state and is the bulk of an unfiltered response; request it only when you need to know which team a state belongs to.",
    }),
  },
  async run({ $ }) {
    const variables = {
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
      includeArchived: this.includeArchived,
    };
    if (this.teamId) {
      variables.filter = {
        team: {
          id: {
            eq: this.teamId,
          },
        },
      };
    }

    const {
      nodes, pageInfo,
    } = await this.linearApp.listStates(variables);

    $.export("$summary", `Found ${nodes?.length ?? 0} workflow state${nodes?.length === 1
      ? ""
      : "s"}`);

    return {
      nodes: fields.projectRecords(nodes, this.fields, {
        compact: COMPACT_FIELDS,
        known: STATE_FIELDS,
      }),
      pageInfo,
    };
  },
};
