import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-labels",
  name: "List Labels",
  description: "List issue labels in Linear. Use this to retrieve label IDs and names for filtering or label-management flows. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=issueLabels).",
  version: "0.0.1",
  type: "action",
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
  },
  async run({ $ }) {
    const {
      nodes, pageInfo,
    } = await this.linearApp.listIssueLabels({
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
    });

    $.export("$summary", `Found ${nodes.length} labels`);

    return {
      nodes,
      pageInfo,
    };
  },
};
