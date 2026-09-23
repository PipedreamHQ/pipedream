import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-project-labels",
  name: "List Project Labels",
  description: "List available project labels in the Linear workspace. Use this to discover valid label IDs when creating or updating projects. Returns an array of label objects with `id`, `name`, and optional `color`. Example: returns `[{id: \"pl1\", name: \"Frontend\", color: \"#0ea5e9\"}, {id: \"pl2\", name: \"Backend\"}]`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=projectLabels).",
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
      description: "Maximum number of project labels to return (default 50).",
      optional: true,
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
      description: "Optional list of field names to include in each returned project label object. When omitted, the full payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"name\", \"color\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      nodes, pageInfo,
    } = await this.linearApp.listProjectLabels({
      first: this.first,
      after: this.after,
    });

    $.export("$summary", `Found ${nodes.length} project label${nodes.length === 1
      ? ""
      : "s"}`);

    if (this.fields?.length) {
      return {
        nodes: nodes.map((label) => {
          const shaped = {};
          for (const field of this.fields) {
            shaped[field] = label[field];
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
