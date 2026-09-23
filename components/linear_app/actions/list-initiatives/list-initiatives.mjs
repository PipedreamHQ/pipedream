import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-initiatives",
  name: "List Initiatives",
  description: "List initiatives in Linear, optionally filtered by name or status. Use this to discover valid initiative IDs for creating updates or linking projects. Returns initiative objects with `id`, `name`, `status`, and `targetDate`. Example: `status: \"Active\"` → returns `{nodes: [{id: \"ini_01abc\", name: \"Q4 Platform Upgrade\", status: \"Active\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=initiatives)",
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
    name: {
      type: "string",
      label: "Name",
      description: "Search for initiatives that contain the provided name",
      optional: true,
    },
    status: {
      propDefinition: [
        linearApp,
        "initiativeStatus",
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
      description: "The number of initiatives to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of initiatives",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned initiative object. When omitted, the full initiative payload is returned (including `content`, which may be long). Pass a subset to reduce response size, e.g. `[\"id\", \"name\", \"status\", \"targetDate\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const variables = {
      filter: {
        name: {
          contains: this.name,
        },
        status: {
          eq: this.status,
        },
      },
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
    };

    const {
      nodes, pageInfo,
    } = await this.linearApp.listInitiatives(variables);

    $.export("$summary", `Found ${nodes.length} initiatives`);

    if (this.fields?.length) {
      return {
        nodes: nodes.map((initiative) => {
          const shaped = {};
          for (const field of this.fields) {
            shaped[field] = initiative[field];
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
