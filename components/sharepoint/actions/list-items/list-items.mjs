import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-list-items",
  name: "List Items",
  description: "Get the collection of items in a SharePoint list, including their field values. Supports OData filtering and field selection. [See the documentation](https://learn.microsoft.com/en-us/graph/api/listitem-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteIdInput",
      ],
    },
    listId: {
      propDefinition: [
        sharepoint,
        "listIdInput",
      ],
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "An OData filter expression to narrow results (e.g. `fields/Status eq 'Active'` or `fields/Quantity lt 100`). **The `Title` column and most custom columns are not indexed by default — when filtering on these, set **Honor Non-Indexed Queries** to `true` to avoid errors.**",
      optional: true,
    },
    select: {
      type: "string",
      label: "Select Fields",
      description: "A comma-separated list of column names to include in each item's `fields` object (e.g. `Title,Status,AssignedTo`). When omitted, all fields are returned. Column names are case-sensitive.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        sharepoint,
        "maxResults",
      ],
    },
    honorNonIndexedQueries: {
      propDefinition: [
        sharepoint,
        "honorNonIndexedQueries",
      ],
    },
  },
  async run({ $ }) {
    const items = [];
    let count = 0;

    const expand = this.select
      ? `fields(select=${this.select})`
      : "fields";

    const headers = this.honorNonIndexedQueries
      ? {
        Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
      }
      : {};

    const results = this.sharepoint.paginate({
      fn: this.sharepoint.listItems,
      args: {
        siteId: this.siteId,
        listId: this.listId,
        params: {
          expand,
          filter: this.filter,
        },
        headers,
      },
    });

    for await (const item of results) {
      items.push(item);
      count++;
      if (this.maxResults && count >= this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully listed ${count} item${count === 1
      ? ""
      : "s"}`);

    return items;
  },
};
