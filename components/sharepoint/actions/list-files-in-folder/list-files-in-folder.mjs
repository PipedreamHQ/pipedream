import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-list-files-in-folder",
  name: "List Files in Folder",
  description: "Retrieves a list of the files and/or folders directly within a folder. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_children)",
  version: "0.0.6",
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
    driveId: {
      propDefinition: [
        sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    folderId: {
      propDefinition: [
        sharepoint,
        "folderId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
    },
    excludeFolders: {
      propDefinition: [
        sharepoint,
        "excludeFolders",
      ],
    },
    select: {
      propDefinition: [
        sharepoint,
        "select",
      ],
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "The field to order the results by",
      default: "lastModifiedDateTime",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      select: this.select,
      orderby: this.orderBy,
    };
    const response = this.folderId
      ? await this.sharepoint.listDriveItemsInFolder({
        $,
        driveId: this.driveId,
        folderId: this.folderId,
        params,
      })
      : await this.sharepoint.listDriveItems({
        $,
        siteId: this.siteId,
        driveId: this.driveId,
        params,
      });
    const values = this.excludeFolders
      ? response.value.filter(({ folder }) => !folder)
      : response.value;

    $.export("$summary", `Found ${values.length} file(s) and/or folder(s)`);
    return values;
  },
};
