import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "microsoft_outlook-add-label-to-email",
  name: "Add Label to Email",
  description: "Adds a label/category to an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-update)",
  version: "0.0.4",
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
          excludeMessageLabels: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const message = await this.microsoftOutlook.getMessage({
      $,
      messageId: this.messageId,
    });

    const labels = message?.categories;

    if (labels.includes(this.label)) {
      throw new ConfigurationError(`Message already contains label "${this.label}".`);
    }

    const response = await this.microsoftOutlook.updateMessage({
      $,
      messageId: this.messageId,
      data: {
        categories: [
          ...labels,
          this.label,
        ],
      },
    });
    $.export("$summary", "Successfully added label to message.");
    return response;
  },
};
