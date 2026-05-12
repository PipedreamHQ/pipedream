import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-workflow-states",
  name: "List Workflow States",
  description: "List workflow states (statuses) in Linear. Returns state IDs, names, types (e.g. backlog, started, completed, cancelled), and team info. Optionally filter by team (use the **Get Teams** action to discover valid team IDs, e.g. `4e80f53c-da9e-4dee-b14e-2cab3e2e8716`). [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=workflowStates).",
  version: "0.0.1",
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
      nodes,
      pageInfo,
    };
  },
};
