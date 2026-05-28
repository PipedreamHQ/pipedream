import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-find-file-by-name",
  name: "Find File by Name",
  description:
    "Search the site's default drive for files or folders matching a query."
    + " Matches are **recursive** across the drive and span **filename, metadata, and file content** — this is **not** an exact filename lookup, and results are relevance-ranked."
    + "\n\n"
    + "Backed by the [SharePoint Search index](https://learn.microsoft.com/en-us/graph/search-concept-overview) and **eventually consistent**, so newly created, renamed, or moved items may not appear until SharePoint reindexes them."
    + "\n\n"
    + "**For exact, immediately-consistent lookups, prefer:**"
    + "\n- **Get File by ID** when the ID is known"
    + "\n- **Search and Filter Files** for OData `$filter` against a list/document library"
    + "\n\n"
    + "[See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-search?view=graph-rest-1.0&tabs=http)",
  version: "0.1.7",
  type: "action",
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
        "siteId",
      ],
    },
    name: {
      type: "string",
      label: "File Name",
      description: "The name of the file or folder to search for",
    },
    returnContentType: {
      type: "string",
      label: "Return Content Type",
      description: "The content type to return",
      options: constants.RETURN_CONTENT_TYPE_OPTIONS,
      default: "all",
    },
    select: {
      type: "string[]",
      label: "Select",
      description: "Use Select to choose only the properties your app needs, as this can lead to performance improvements. E.g. `[\"name\", \"id\", \"createdDateTime\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};

    if (this.select) {
      params.select = utils.parseObject(this.select)?.join();
    }

    let { value } = await this.sharepoint.searchDriveItems({
      $,
      siteId: this.siteId,
      query: this.name,
      params,
    });

    if (this.returnContentType === "files") {
      value = value.filter(({ file }) => file);
    } else if (this.returnContentType === "folders") {
      value = value.filter(({ folder }) => folder);
    }

    value = value.map((item) => {
      return {
        contentType: item.folder
          ? "folder"
          : "file",
        ...item,
      };
    });

    $.export("$summary", `Found ${value.length} matching ${this.returnContentType === "files"
      ? "file"
      : "folder"}${value.length === 1
      ? ""
      : "s"}`);
    return value;
  },
};
