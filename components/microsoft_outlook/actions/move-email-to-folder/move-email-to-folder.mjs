import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-move-email-to-folder",
  name: "Move Email to Folder",
  description: "Moves an email to the specified folder in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-move)",
  version: "0.0.8",
  type: "action",
  props: {
    microsoftOutlook,
    messageId: {
      propDefinition: [
        microsoftOutlook,
        "messageId",
      ],
    },
    folderId: {
      propDefinition: [
        microsoftOutlook,
        "folderIds",
      ],
      type: "string",
      label: "Folder ID",
      description: "The identifier of the folder to move the selected message to",
    },
  },
  async run({ $ }) {
    const response = await this.microsoftOutlook.moveMessage({
      $,
      messageId: this.messageId,
      data: {
        destinationId: this.folderId,
      },
    });
    $.export("$summary", `Successfully moved email to folder with ID: ${this.folderId}`);
    return response;
  },
};
