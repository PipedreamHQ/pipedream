import dropbox from "../../dropbox.app.mjs";
import isNil from "lodash/isNil.js";
import get from "lodash/get.js";
import consts from "../../consts.mjs";

export default {
  name: "Search files and folders",
  description: "Searches for files and folders by name. [See the docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesSearchV2__anchor)",
  key: "dropbox-search-files-folders",
  version: "0.0.1",
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
        "pathFolder",
      ],
      optional: true,
      description: "Scopes the search to a path in the user's Dropbox. Searches the entire Dropbox if not specified.",
    },
    orderBy: {
      type: "string",
      label: "Order by",
      description: "By default, results are sorted by relevance.",
      optional: true,
      options: consts.SEARCH_FILE_FOLDER_ORDER_BY_OPTIONS,
    },
    fileStatus: {
      type: "string",
      label: "File status",
      description: "Restricts search to the given file status.",
      optional: true,
      options: consts.SEARCH_FILE_FOLDER_STATUS_OPTIONS,
    },
    filenameOnly: {
      type: "boolean",
      label: "Filename only",
      description: "Restricts search to only match on filenames.",
      optional: true,
    },
    fileCategories: {
      type: "string[]",
      label: "File categories",
      description: "Restricts search to only the file categories specified. Only supported for active file search.",
      optional: true,
      options: consts.FILES_CATEGORIES_OPTIONS,
    },
    fileExtensions: {
      type: "string[]",
      label: "File extensions",
      description: "Restricts search to only the extensions specified. Only supported for active file search.",
      optional: true,
    },
    includeHighlights: {
      type: "boolean",
      label: "Include highlights",
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
      fileExtensions,
      fileCategories,
    } = this;
    const res = await this.dropbox.searchFilesFolders({
      query,
      match_field_options: !isNil(includeHighlights)
        ? undefined
        : {
          include_highlights: includeHighlights,
        },
      options: {
        path: get(path, "value", path) || "",
        order_by: orderBy
          ? {
            ".tag": orderBy,
          }
          : undefined,
        file_status: fileStatus
          ? {
            ".tag": fileStatus,
          }
          : undefined,
        filename_only: filenameOnly,
        file_extensions: fileExtensions,
        file_categories: fileCategories
          ? fileCategories.map((category) => ({
            ".tag": category,
          }))
          : undefined,
      },
    }, limit);
    $.export("$summary", "Files and folders successfully fetched");
    return res;
  },
};
