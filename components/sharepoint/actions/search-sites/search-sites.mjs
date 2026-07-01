import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-search-sites",
  name: "Search Sites",
  description:
    "Search for sites across the tenant."
    + " This is a free-text search across multiple site properties — *not* an exact slug match."
    + "\n\n"
    + "Backed by the [SharePoint Search index](https://learn.microsoft.com/en-us/graph/search-concept-overview) and **eventually consistent**, so newly created or renamed sites may not appear until indexing catches up."
    + "\n\n"
    + "To resolve a known site by path, prefer **Get Site** for an immediate, exact lookup."
    + "\n\n"
    + "[See the documentation](https://learn.microsoft.com/en-us/graph/api/site-search?view=graph-rest-1.0&tabs=http)",
  version: "0.0.7",
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
