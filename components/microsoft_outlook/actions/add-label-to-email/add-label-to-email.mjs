import { ConfigurationError } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-add-label-to-email",
  name: "Add Label to Email",
  description: "Adds a label/category to an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-update)",
  version: "0.0.20",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftOutlook,
    userId: {
      propDefinition: [
        microsoftOutlook,
        "userId",
      ],
      optional: true,
      description: "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
    },
    messageId: {
      propDefinition: [
        microsoftOutlook,
        "messageId",
        ({ userId }) => ({
          userId,
        }),
      ],
    },
    label: {
      propDefinition: [
        microsoftOutlook,
        "label",
        (c) => ({
          userId: c.userId,
          messageId: c.messageId,
          excludeMessageLabels: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const message = await this.microsoftOutlook.getMessage({
      $,
      userId: this.userId,
      messageId: this.messageId,
    });

    const labels = message?.categories;

    if (labels.includes(this.label)) {
      throw new ConfigurationError(`Message already contains label "${this.label}".`);
    }

    const response = await this.microsoftOutlook.updateMessage({
      $,
      userId: this.userId,
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
