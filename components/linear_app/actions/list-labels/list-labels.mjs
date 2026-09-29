import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-list-labels",
  name: "List Labels",
  description: "List issue labels in the Linear workspace. Use this to discover valid label names and IDs for creating or filtering issues. Returns label objects with `id`, `name`, and `color`. Example: `first: 50` → returns `{nodes: [{id: \"lbl_bug123\", name: \"Bug\", color: \"#ef4444\"}, {id: \"lbl_fe456\", name: \"Frontend\", color: \"#0ea5e9\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=issueLabels).",
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
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
    first: {
      type: "integer",
      label: "First",
      description: "The number of labels to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "Cursor for pagination to fetch the next page (example: \"label_01J8XYZABCDEF123456789\").",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Cursor for pagination to fetch the previous page (example: \"label_01J8XYZABCDEF123456789\").",
      optional: true,
    },
    last: {
      type: "integer",
      label: "Last",
      description: "The number of items to backward paginate (used with before). Defaults to 50.",
      optional: true,
    },
    includeArchived: {
      propDefinition: [
        linearApp,
        "includeArchived",
      ],
    },
    filter: {
      type: "object",
      label: "Filter",
      description: "Filter returned issue labels. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/inputs/IssueLabelFilter) for more details. Example: `{ \"name\": { \"contains\": \"Bug\" } }`",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned label object. When omitted, the full label payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"name\", \"color\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const filter = typeof this.filter === "string"
      ? JSON.parse(this.filter)
      : this.filter;
    const {
      nodes, pageInfo,
    } = await this.linearApp.listIssueLabels({
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
      before: this.before,
      last: this.last,
      includeArchived: this.includeArchived,
      filter,
    });

    $.export("$summary", `Found ${nodes.length} labels`);

    return {
      nodes: nodes.map((label) => utils.pickFields(label, this.fields)),
      pageInfo,
    };
  },
};
