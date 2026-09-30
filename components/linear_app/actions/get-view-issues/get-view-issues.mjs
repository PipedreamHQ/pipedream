import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-get-view-issues",
  name: "Get View Issues",
  description: "Retrieve issues filtered by a saved custom view in Linear. Custom views encapsulate pre-configured filters (team, state, assignee, labels, etc.). Use **List Views** to find the view ID. Use the optional `fields` prop to narrow the response to only the keys you need (reduces context for large result sets). Example: `viewId: \"cv1b2c3d4-...\"` → returns `{nodes: [{id: \"iss_01\", identifier: \"ENG-42\", title: \"Fix login\", state: {name: \"In Progress\"}}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=customView)",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned issue object. When omitted, the full issue payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"identifier\", \"title\", \"state\"]`.",
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

    return {
      nodes: response.nodes.map((issue) => utils.pickFields(issue, this.fields)),
      pageInfo: response.pageInfo,
    };
  },
};
