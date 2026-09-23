import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-users",
  name: "List Users",
  description: "List members of the Linear workspace. Use this to discover valid user IDs for assigning issues or initiatives. Returns an array of user objects including `id`, `name`, and `email`. Supports pagination via `first`/`after`. Example: call with no filters to list all members → returns `[{id: \"abc123\", name: \"Alice\", email: \"alice@acme.com\"}, ...]`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=users).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    first: {
      type: "integer",
      label: "First",
      description: "Maximum number of users to return (default 50).",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "Pagination cursor from a previous response's `pageInfo.endCursor` to fetch the next page.",
      optional: true,
    },
    includeArchived: {
      propDefinition: [
        linearApp,
        "includeArchived",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned user object. When omitted, the full user payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"name\", \"email\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      nodes, pageInfo,
    } = await this.linearApp.listUsers({
      first: this.first,
      after: this.after,
      includeArchived: this.includeArchived,
    });

    $.export("$summary", `Found ${nodes.length} user${nodes.length === 1
      ? ""
      : "s"}`);

    if (this.fields?.length) {
      return {
        nodes: nodes.map((user) => {
          const shaped = {};
          for (const field of this.fields) {
            shaped[field] = user[field];
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
