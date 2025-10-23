import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-create-folder",
  name: "Create Folder",
  description: "Create a new folder in SharePoint. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_post_children?view=odsp-graph-online)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      label: "Parent Folder ID",
      description: "The ID of the folder in which the the new folder should be created. You can either search for the folder here or provide a custom *Folder ID*.",
    },
    folderName: {
      type: "string",
      label: "Folder Name",
      description: "The name of the new folder to be created. e.g. `New Folder`",
    },
  },
  async run({ $ }) {
    const data = {
      name: this.folderName,
      folder: {},
    };
    const response = this.folderId
      ? await this.sharepoint.createDriveItemInFolder({
        $,
        siteId: this.siteId,
        folderId: this.folderId,
        data,
      })
      : await this.sharepoint.createDriveItem({
        $,
        siteId: this.siteId,
        driveId: this.driveId,
        data,
      });

    if (response?.id) {
      $.export("$summary", `Successfully created folder with ID ${response.id}.`);
    }

    return response;
  },
};
