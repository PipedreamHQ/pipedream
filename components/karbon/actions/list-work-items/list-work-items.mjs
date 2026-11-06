import app from "../../karbon.app.mjs";

export default {
  key: "karbon-list-work-items",
  name: "List Work Items",
  description: "List the work items in your Karbon tenant, optionally filtered by assignee, client, status or start date. Use the `WorkItemKey` field with **Get Work Item**."
    + " [See the documentation](https://karbonhq.github.io/karbon-api-reference/#get-/v3/WorkItems)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
      description: "An OData filter on properties such as `AssigneeEmailAddress`, `ClientKey`, `PrimaryStatus`, `StartDate` and `Title`, e.g. `PrimaryStatus eq 'In Progress'`. Write statuses with spaces, because `InProgress` returns no results.",
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "How to sort the results, e.g. `DeadlineDate desc`.",
      options: [
        "StartDate",
        "StartDate desc",
        "DeadlineDate",
        "DeadlineDate desc",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const records = await this.app.paginate({
      $,
      fn: this.app.listWorkItems,
      maxResults: this.maxResults,
      params: {
        $filter: this.filter,
        $orderby: this.orderBy,
      },
    });
    $.export("$summary", `Found ${records.length} work item${records.length === 1
      ? ""
      : "s"}`);
    return records;
  },
};
