import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-find-file-by-name",
  name: "Find File by Name",
  description: "Search for a file or folder by name. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_search)",
  version: "0.1.3",
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
