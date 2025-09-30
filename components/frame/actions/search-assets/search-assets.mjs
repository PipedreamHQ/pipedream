import frame from "../../frame.app.mjs";

export default {
  key: "frame-search-assets",
  name: "Search Assets",
  description: "Performs advanced searching for assets in Frame.io. [See the documentation](https://developer.frame.io/api/reference/operation/librarySearchGet/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frame,
    accountId: {
      propDefinition: [
        frame,
        "accountId",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search text",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sorting parameters",
      optional: true,
    },
    includeDeleted: {
      type: "boolean",
      label: "Include Deleted",
      description: "Flag to include soft-deleted records in results",
      optional: true,
    },
    filterType: {
      type: "string",
      label: "Filter Type",
      description: "If specified, only assets of this type will be returned.",
      optional: true,
      options: [
        "file",
        "folder",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page to retrieve",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of results to include in the page",
      optional: true,
    },
  },
  async run({ $ }) {
    let response = await this.frame.searchAssets({
      $,
      params: {
        account_id: this.accountId,
        q: this.query,
        include_deleted: this.includeDeleted,
        page: this.page,
        page_size: this.pageSize,
        sort: this.sort,
      },
    });
    if (this.filterType) response = response?.filter((e) => e.type === this.filterType);
    $.export("$summary", `Successfully retrieved ${response?.length} assets`);
    return response;
  },
};
