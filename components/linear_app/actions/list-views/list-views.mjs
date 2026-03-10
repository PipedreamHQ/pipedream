import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-views",
  name: "List Views",
  description: "List views in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=views)",
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
      description: "Filter views by team",
      optional: true,
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
      description: "The number of views to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of views",
      optional: true,
    },
  },
  async run({ $ }) {
    const variables = {
      filter: {
        team: {
          id: {
            eq: this.teamId,
          },
        },
      },
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
    };

    const {
      nodes, pageInfo,
    } = await this.linearApp.listCustomViews(variables);

    $.export("$summary", `Found ${nodes.length} view${nodes.length === 1
      ? ""
      : "s"}`);

    return {
      nodes,
      pageInfo,
    };
  },
};
