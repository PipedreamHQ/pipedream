import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-list-lists",
  name: "List Lists",
  description: "Get the collection of lists for a SharePoint site. Returns each list's ID, name, and template type. [See the documentation](https://learn.microsoft.com/en-us/graph/api/list-list?view=graph-rest-1.0&tabs=http)",
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
    select: {
      propDefinition: [
        sharepoint,
        "select",
      ],
    },
    maxResults: {
      propDefinition: [
        sharepoint,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const lists = [];
    let count = 0;

    const results = this.sharepoint.paginate({
      fn: this.sharepoint.listLists,
      args: {
        siteId: this.siteId,
        params: {
          select: this.select,
        },
      },
    });

    for await (const list of results) {
      lists.push(list);
      count++;
      if (this.maxResults && count >= this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully listed ${count} list${count === 1
      ? ""
      : "s"}`);

    return lists;
  },
};
