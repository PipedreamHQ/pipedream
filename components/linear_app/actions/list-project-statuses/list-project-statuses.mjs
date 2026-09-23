import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-project-statuses",
  name: "List Project Statuses",
  description: "List available project statuses in the Linear workspace. Use this to discover valid status IDs when creating or updating projects. Returns an array of status objects with `id`, `name`, and `type`. Example: returns `[{id: \"s1\", name: \"Planned\", type: \"planned\"}, {id: \"s2\", name: \"In Progress\", type: \"started\"}, ...]`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=projectStatuses).",
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
      description: "Maximum number of project statuses to return (default 50).",
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
      description: "Optional list of field names to include in each returned project status object. When omitted, the full payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"name\", \"type\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      nodes, pageInfo,
    } = await this.linearApp.listProjectStatuses({
      first: this.first,
      after: this.after,
    });

    $.export("$summary", `Found ${nodes.length} project status${nodes.length === 1
      ? ""
      : "es"}`);

    if (this.fields?.length) {
      return {
        nodes: nodes.map((status) => {
          const shaped = {};
          for (const field of this.fields) {
            shaped[field] = status[field];
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
