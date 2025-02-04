import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-add-label-to-email",
  name: "Add Label to Email",
  description: "Adds a label/category to an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-update)",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftOutlook,
    messageId: {
      propDefinition: [
        microsoftOutlook,
        "messageId",
      ],
    },
    labelId: {
      propDefinition: [
        microsoftOutlook,
        "labelId",
      ],
    },
  },
  async run({ $ }) {
    const message = await this.microsoftOutlook.getMessage({
      $,
      messageId: this.messageId,
    });

    const labels = message?.categories;

    const response = await this.microsoftOutlook.updateMessage({
      $,
      messageId: this.messageId,
      data: {
        categories: [
          ...labels,
          this.labelId,
        ],
      },
    });
    $.export("$summary", "Successfully added label to message.");
    return response;
  },
};
