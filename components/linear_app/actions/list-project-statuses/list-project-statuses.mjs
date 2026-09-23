import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-list-project-statuses",
  name: "List Project Statuses",
  description: "List available project statuses in the Linear workspace. Use this to discover valid status IDs when creating or updating projects. Returns `{nodes, pageInfo}`, where each node includes `id`, `name`, and `type`. If `pageInfo.hasNextPage` is `true`, call again with `after` set to `pageInfo.endCursor` to fetch more. Example: returns `{nodes: [{id: \"5a1b2c3d-0000-0000-0000-000000000006\", name: \"Planned\", type: \"planned\"}], pageInfo: {endCursor: \"5a1b2c3d-0000-0000-0000-000000000006\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=projectStatuses).",
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
      description: "Optional list of field names to include in each returned project status object. When omitted, the full payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"name\", \"type\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      nodes, pageInfo,
    } = await this.linearApp.listProjectStatuses({
      first: utils.clampFirst(this.first),
      after: this.after,
    });

    $.export("$summary", `Found ${nodes.length} project status${nodes.length === 1
      ? ""
      : "es"}`);

    return {
      nodes: nodes.map((status) => utils.pickFields(status, this.fields)),
      pageInfo,
    };
  },
};
