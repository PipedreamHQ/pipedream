import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-views",
  name: "List Views",
  description: "List saved custom views in Linear. Use this to discover valid view IDs for the **Get View Issues** action. Custom views combine filters (team, assignee, state, labels, etc.) into a reusable saved search. Optionally filter by team. Example: `teamId: \"9d1c3f7e-...\"` → returns `{nodes: [{id: \"cv1abc\", name: \"My Open Issues\", teamId: \"9d1c3f7e-...\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=views)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
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
      description: "Filter views by team. Use **Get Teams** to discover valid team IDs.",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned view object. When omitted, the full view payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"name\"]`.",
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

    if (this.fields?.length) {
      return {
        nodes: nodes.map((view) => {
          const shaped = {};
          for (const field of this.fields) {
            shaped[field] = view[field];
          }
          return shaped;
        }),
        pageInfo,
      };
    }

    return {
      nodes,
      pageInfo,
    };
  },
};
