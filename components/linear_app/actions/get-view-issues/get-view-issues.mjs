import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-get-view-issues",
  name: "Get View Issues",
  description: "Get issues from a custom view in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=customView)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    viewId: {
      propDefinition: [
        linearApp,
        "customViewId",
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
      description: "The number of issues to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of issues",
      optional: true,
    },
  },
  async run({ $ }) {
    const { filterData } = await this.linearApp.getCustomView(this.viewId);
    const response = await this.linearApp.listIssues({
      filter: filterData,
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
    });
    $.export("$summary", `Found ${response.nodes.length} issue${response.nodes.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
