import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-remove-label-from-email",
  name: "Remove Label from Email",
  description: "Removes a label/category from an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-update)",
  version: "0.0.14",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftOutlook,
    messageId: {
      propDefinition: [
        microsoftOutlook,
        "messageId",
      ],
    },
    label: {
      propDefinition: [
        microsoftOutlook,
        "label",
        (c) => ({
          messageId: c.messageId,
          onlyMessageLabels: true,
        }),
      ],
      description: "The name of the label/category to remove",
    },
  },
  async run({ $ }) {
    const message = await this.microsoftOutlook.getMessage({
      $,
      messageId: this.messageId,
    });
    let labels = message?.categories;

    const index = labels.indexOf(this.label);
    if (index > -1) {
      labels.splice(index, 1);
    }

    const response = await this.microsoftOutlook.updateMessage({
      $,
      messageId: this.messageId,
      data: {
        categories: labels,
      },
    });
    $.export("$summary", "Successfully removed label from message.");
    return response;
  },
};
