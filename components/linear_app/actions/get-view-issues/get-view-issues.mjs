import linearApp from "../../linear_app.app.mjs";
import fields from "../../common/fields.mjs";
import fieldSets from "../../common/field-sets.mjs";

// A custom view is usually a saved filter over a broad slice of the workspace ("all
// open bugs"), so this returns the same full-width Issue objects Search Issues does
// and is exposed to the same overflow. Bounded by default for that reason.
const DEFAULT_FIRST = 50;

export default {
  key: "linear_app-get-view-issues",
  name: "Get View Issues",
  description: "Get issues from a custom view in Linear. Use **List Views** first to find the view's id. **Response size matters here:** a view is a saved filter that can cover a large slice of the workspace, and every matching issue is returned at full width — the `description` body plus nested `team`, `project`, `cycle` and `parent` objects. Pass `fields: \"compact\"` (`id,identifier,title,state,assignee,priorityLabel`) unless you specifically need more, and use `first` to cap how many come back. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=customView)",
  version: "0.1.0",
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
      description: `The number of issues to return (defaults to ${DEFAULT_FIRST}). Use \`after\` with the returned cursor to page through more.`,
      optional: true,
      default: DEFAULT_FIRST,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of issues",
      optional: true,
    },
    fields: {
      propDefinition: [
        linearApp,
        "fields",
      ],
      description: fields.fieldsDescription({
        resource: "issues",
        compact: fieldSets.issue.compact,
        guidance: fieldSets.issue.guidance,
      }),
    },
  },
  async run({ $ }) {
    const { filterData } = await this.linearApp.getCustomView(this.viewId);
    const response = await this.linearApp.listIssues({
      filter: filterData,
      orderBy: this.orderBy,
      first: this.first ?? DEFAULT_FIRST,
      after: this.after,
    });
    $.export("$summary", `Found ${response.nodes.length} issue${response.nodes.length === 1
      ? ""
      : "s"}`);
    return {
      ...response,
      nodes: fields.projectRecords(response.nodes, this.fields, {
        compact: fieldSets.issue.compact,
        known: fieldSets.issue.known,
      }),
    };
  },
};
