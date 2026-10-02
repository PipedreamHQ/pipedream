import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-list-project-labels",
  name: "List Project Labels",
  description: "List available project labels in the Linear workspace. Use this to discover valid label IDs when creating or updating projects. Returns `{nodes, pageInfo}`, where each node includes `id`, `name`, and optional `color`. If `pageInfo.hasNextPage` is `true`, call again with `after` set to `pageInfo.endCursor` to fetch more. Example: returns `{nodes: [{id: \"9a1b2c3d-0000-0000-0000-000000000007\", name: \"Frontend\", color: \"#0ea5e9\"}], pageInfo: {endCursor: \"9a1b2c3d-0000-0000-0000-000000000007\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=projectLabels).",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned project label object. When omitted, the full payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"name\", \"color\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      nodes, pageInfo,
    } = await this.linearApp.listProjectLabels({
      first: utils.clampFirst(this.first),
      after: this.after,
    });

    $.export("$summary", `Found ${nodes.length} project label${nodes.length === 1
      ? ""
      : "s"}`);

    return {
      nodes: nodes.map((label) => utils.pickFields(label, this.fields)),
      pageInfo,
    };
  },
};
