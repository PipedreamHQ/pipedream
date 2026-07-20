import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-get-shared-folder",
  name: "Get Shared Folder",
  description: "Retrieve a single folder from a shared mailbox by its ID. Returns the folder's `id`, `displayName`, `parentFolderId`, `childFolderCount`, `totalItemCount`, and `unreadItemCount`. If you only have a display name and need the ID, use **List Shared Folders** first. [See the documentation](https://learn.microsoft.com/en-us/graph/api/mailfolder-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
    userId: {
      propDefinition: [
        microsoftOutlook,
        "userId",
      ],
    },
    folderId: {
      propDefinition: [
        microsoftOutlook,
        "sharedFolderId",
        ({ userId }) => ({
          userId,
        }),
      ],
      label: "Folder ID",
      description: "The ID of the folder to retrieve from the shared mailbox",
    },
  },
  async run({ $ }) {
    const folder = await this.microsoftOutlook.getSharedFolderById({
      userId: this.userId,
      folderId: this.folderId,
    });

    if (!folder) {
      throw new Error(`Folder with ID "${this.folderId}" not found in shared mailbox "${this.userId}".`);
    }

    $.export("$summary", `Successfully retrieved shared folder "${folder.displayName}"`);
    return folder;
  },
};
