import dropbox from "../../dropbox.app.mjs";
import isNil from "lodash/isNil.js";
import consts from "../../consts.mjs";

export default {
  name: "Search files and folders",
  description: "Searches for files and folders by name",
  key: "dropbox-search-files-and-folders",
  version: "0.0.47",
  type: "action",
  props: {
    dropbox,
    query: {
      propDefinition: [
        dropbox,
        "query",
      ],
    },
    path: {
      propDefinition: [
        dropbox,
        "path",
      ],
      optional: true,
      description: "Scopes the search to a path in the user's Dropbox. Searches the entire Dropbox if not specified.",
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Specified property of the order of search results. By default, results are sorted by relevance.",
      optional: true,
      options: consts.SEARCH_FILE_FOLDER_ORDER_BY_OPTIONS,
    },
    fileStatus: {
      type: "string",
      label: "File Status",
      description: "Restricts search to the given file status.",
      optional: true,
      options: consts.SEARCH_FILE_FOLDER_STATUS_OPTIONS,
    },
    filenameOnly: {
      type: "boolean",
      label: "Filename Only",
      description: "Restricts search to only match on filenames.",
      optional: true,
    },
    includeHighlights: {
      type: "boolean",
      label: "Include Highlights",
      description: "Whether to include highlight span from file title.",
      optional: true,
    },
    limit: {
      propDefinition: [
        dropbox,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      query,
      includeHighlights,
      limit,
      path,
      orderBy,
      fileStatus,
      filenameOnly,
    } = this;
    const res = await this.dropbox.searchFilesFolders({
      query,
      match_field_options: !isNil(includeHighlights)
        ? undefined
        : {
          include_highlights: includeHighlights,
        },
      options: {
        path,
        order_by: orderBy
          // eslint-disable-next-line object-curly-newline
          ? { ".tag": orderBy }
          : undefined,
        file_status: fileStatus
          // eslint-disable-next-line object-curly-newline
          ? { ".tag": fileStatus }
          : undefined,
        filename_only: filenameOnly,
      },
    }, limit);
    $.export("$summary", "Query successfully fetched");
    return res;
  },
};
