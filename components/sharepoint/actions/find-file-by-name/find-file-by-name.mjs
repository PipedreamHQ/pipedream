import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-find-file-by-name",
  name: "Find File by Name",
  description: "Search for a file or folder by name. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_search)",
  version: "0.0.3",
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
    excludeFolders: {
      propDefinition: [
        sharepoint,
        "excludeFolders",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sharepoint.searchDriveItems({
      $,
      siteId: this.siteId,
      query: this.name,
    });
    let values = response.value.filter(
      ({ name }) => name.toLowerCase().includes(this.name.toLowerCase()),
    );
    if (this.excludeFolders) {
      values = values.filter(({ folder }) => !folder);
    }

    $.export("$summary", `Found ${values.length} matching file${values.length === 1
      ? ""
      : "s"}`);
    return values;
  },
};
