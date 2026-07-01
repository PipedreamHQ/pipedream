import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-search-files",
  name: "Search Files",
  description:
    "Search for files across the tenant."
    + " Supports KQL via the optional query template."
    + "\n\n"
    + "Backed by the [Microsoft Search index](https://learn.microsoft.com/en-us/graph/search-concept-overview) and **eventually consistent** — newly created or modified files may not appear until indexing catches up."
    + "\n\n"
    + "**For immediate, deterministic results, prefer:**"
    + "\n- **Get File by ID** when the ID is known"
    + "\n- **List Files in Folder** for path-based listing"
    + "\n- **Search and Filter Files** for OData `$filter` against a document library"
    + "\n\n"
    + "[See the documentation](https://learn.microsoft.com/en-us/graph/api/search-query?view=graph-rest-1.0&tabs=http)",
  version: "0.0.7",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    queryString: {
      type: "string",
      label: "Query String",
      description: "The search query containing the search terms",
    },
    queryTemplate: {
      type: "string",
      label: "Query Template",
      description: "Provides a way to decorate the query string. Supports both KQL and query variables. Example: `({searchTerms}) AuthorOWSUSER:Adventure` [See the documentation](https://learn.microsoft.com/en-us/graph/search-concept-query-template) for more information.",
      optional: true,
    },
    select: {
      propDefinition: [
        sharepoint,
        "select",
      ],
    },
    size: {
      propDefinition: [
        sharepoint,
        "maxResults",
      ],
      max: 500,
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "The field to sort the results by",
      default: "lastModifiedDateTime",
      optional: true,
    },
    descending: {
      type: "boolean",
      label: "Descending",
      description: "Whether to sort the results in descending order",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sharepoint.searchQuery({
      $,
      data: {
        requests: [
          {
            entityTypes: [
              "driveItem",
            ],
            query: {
              queryString: this.queryString,
              queryTemplate: this.queryTemplate,
            },
            fields: this.select
              ? this.select.split(",").map((f) => f.trim())
              : undefined,
            size: this.size,
            sortProperties: [
              {
                name: this.sortField,
                isDescending: this.descending,
              },
            ],
          },
        ],
      },
    });
    $.export("$summary", `Successfully searched for ${this.queryString}`);
    return response;
  },
};
