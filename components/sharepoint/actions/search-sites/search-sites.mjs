import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-search-sites",
  name: "Search Sites",
  description: "Search for sites in Microsoft Sharepoint. [See the documentation](https://learn.microsoft.com/en-us/graph/api/site-search?view=graph-rest-1.0&tabs=http)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for",
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
    const sites = [];
    let count = 0;

    const results = this.sharepoint.paginate({
      fn: this.sharepoint.listAllSites,
      args: {
        $,
        params: {
          search: this.query,
          select: this.select,
        },
      },
    });

    for await (const site of results) {
      sites.push(site);
      count++;
      if (this.maxResults && count >= this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully listed ${count} site${count === 1
      ? ""
      : "s"}`);

    return sites;
  },
};
