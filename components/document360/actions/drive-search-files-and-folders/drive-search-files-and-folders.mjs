import app from "../../document360.app.mjs";

export default {
  key: "document360-drive-search-files-and-folders",
  name: "Drive Search - Files and Folders",
  description: "Search for files and folders in Document360 Drive. [See the documentation](https://apidocs.document360.com/apidocs/drive-search-files-and-folders)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    searchKeyword: {
      type: "string",
      label: "Search Keyword",
      description: "Keyword to search file items from drive",
    },
    pageNo: {
      type: "integer",
      label: "Page Number",
      description: "Specify the page to retrieve. Page numbers are zero-based. Therefore, to retrieve the 10th page, you need to set `9`",
      optional: true,
    },
    take: {
      type: "integer",
      label: "Take",
      description: "The number of results per page",
      optional: true,
    },
    allowImagesOnly: {
      type: "boolean",
      label: "Allow Images Only",
      description: "Allow images only in response",
      optional: true,
    },
    userIds: {
      type: "string[]",
      label: "User IDs",
      description: "Find by userId",
      optional: true,
      propDefinition: [
        app,
        "userId",
      ],
    },
    filterFromDate: {
      type: "string",
      label: "Filter From Date",
      description: "Filter using from-date (date-time format). Example: `2025-01-01T00:00:00Z`",
      optional: true,
    },
    filterToDate: {
      type: "string",
      label: "Filter To Date",
      description: "Filter using to-date (date-time format). Example: `2025-01-01T00:00:00Z`",
      optional: true,
    },
    filterTags: {
      type: "string[]",
      label: "Filter Tags",
      description: "Filter using tagIds",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      searchKeyword,
      pageNo,
      take,
      allowImagesOnly,
      userIds,
      filterFromDate,
      filterToDate,
      filterTags,
    } = this;

    const response = await app.driveSearchFilesAndFolders({
      $,
      params: {
        searchKeyword,
        pageNo,
        take,
        allowImagesOnly,
        userIds,
        filterFromDate,
        filterToDate,
        filterTags,
      },
    });

    $.export("$summary", `Successfully searched for files and folders with keyword \`${searchKeyword}\``);
    return response;
  },
};
