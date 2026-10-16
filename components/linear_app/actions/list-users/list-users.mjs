import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-list-users",
  name: "List Users",
  description: "List members of the Linear workspace. Use this to discover valid user IDs for assigning issues or initiatives. Returns `{nodes, pageInfo}`, where each node includes `id`, `name`, and `email`. If `pageInfo.hasNextPage` is `true`, call again with `after` set to `pageInfo.endCursor` to fetch more. Example: call with no filters to list all members → returns `{nodes: [{id: \"abc123\", name: \"Alice\", email: \"alice@acme.com\"}], pageInfo: {endCursor: \"abc123\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=users).",
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
      propDefinition: [
        linearApp,
        "first",
      ],
    },
    after: {
      propDefinition: [
        linearApp,
        "after",
      ],
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
      first: utils.clampFirst(this.first),
      after: this.after,
      includeArchived: this.includeArchived,
    });

    $.export("$summary", `Found ${nodes.length} user${nodes.length === 1
      ? ""
      : "s"}`);

    return {
      nodes: nodes.map((user) => utils.pickFields(user, this.fields)),
      pageInfo,
    };
  },
};
