import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-get-folder",
  name: "Get Folder",
  description: "Retrieve a single mail folder by its ID. Returns the folder's `id`, `displayName`, `parentFolderId`, `childFolderCount`, `totalItemCount`, and `unreadItemCount`. If you only have a display name and need the ID, use **List Folders** first. [See the documentation](https://learn.microsoft.com/en-us/graph/api/mailfolder-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
    folderId: {
      propDefinition: [
        microsoftOutlook,
        "folderId",
      ],
    },
  },
  async run({ $ }) {
    const folder = await this.microsoftOutlook.getFolderById({
      folderId: this.folderId,
    });

    if (!folder) {
      throw new Error(`Folder with ID "${this.folderId}" not found.`);
    }

    $.export("$summary", `Successfully retrieved folder "${folder.displayName}"`);
    return folder;
  },
};
