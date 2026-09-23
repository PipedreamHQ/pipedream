import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-list-project-updates",
  name: "List Project Updates",
  description: "List project updates in Linear, optionally scoped to a single project. Use **List Projects** to find a project ID. Returns update objects with `id`, `body`, `health`, `createdAt`, and author. Example: `projectId: \"a1b2c3d4-0000-0000-0000-000000000001\"`, `first: 10` → returns `{nodes: [{id: \"pu_01xyz\", body: \"Q3 milestone complete.\", health: \"onTrack\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectUpdateConnection?query=projectUpdates).",
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
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
      description: "The ID of the project to scope updates to (a UUID, e.g. `a1b2c3d4-0000-0000-0000-000000000001`). Run **List Projects** first to obtain a valid project ID. Leave blank to list updates across all accessible projects.",
      optional: true,
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
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
      description: "Optional list of field names to include in each returned project update object. When omitted, the full payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"body\", \"health\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const filter = {};
    if (this.projectId) {
      filter.project = {
        id: {
          eq: this.projectId,
        },
      };
    }

    const variables = {
      filter,
      orderBy: this.orderBy,
      first: utils.clampFirst(this.first),
      after: this.after,
    };

    const {
      nodes, pageInfo,
    } = await this.linearApp.listProjectUpdates(variables);

    $.export("$summary", `Found ${nodes.length} project update${nodes.length === 1
      ? ""
      : "s"}`);

    return {
      nodes: nodes.map((update) => utils.pickFields(update, this.fields)),
      pageInfo,
    };
  },
};
