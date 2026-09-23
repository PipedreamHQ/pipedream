import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-initiative-updates",
  name: "List Initiative Updates",
  description: "List initiative updates in Linear, optionally scoped to a single initiative. Use **List Initiatives** to find an initiative ID. Returns update objects with `id`, `body`, `health`, `createdAt`, and author. Example: `initiativeId: \"b2c3d4e5-0000-0000-0000-000000000002\"`, `first: 10` → returns `{nodes: [{id: \"iu_01xyz\", body: \"Two projects completed.\", health: \"onTrack\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/InitiativeUpdateConnection?query=initiativeUpdates).",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    initiativeId: {
      type: "string",
      label: "Initiative ID",
      description: "The ID of the initiative to scope updates to (a UUID, e.g. `b2c3d4e5-0000-0000-0000-000000000002`). Run **List Initiatives** first to obtain a valid initiative ID. Leave blank to list updates across all accessible initiatives.",
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
      description: "Maximum number of initiative updates to return (min 1, max 1000).",
      optional: true,
      min: 1,
      max: 1000,
    },
    after: {
      type: "string",
      label: "After",
      description: "Pagination cursor from a previous response's `pageInfo.endCursor` to fetch the next page.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned initiative update object. When omitted, the full payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"body\", \"health\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const filter = {};
    if (this.initiativeId) {
      filter.initiative = {
        id: {
          eq: this.initiativeId,
        },
      };
    }

    const variables = {
      filter,
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
    };

    const {
      nodes, pageInfo,
    } = await this.linearApp.listInitiativeUpdates(variables);

    $.export("$summary", `Found ${nodes.length} initiative update${nodes.length === 1
      ? ""
      : "s"}`);

    if (this.fields?.length) {
      return {
        nodes: nodes.map((update) => {
          const shaped = {};
          for (const field of this.fields) {
            shaped[field] = update[field];
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
