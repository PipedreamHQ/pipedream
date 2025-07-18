import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-send-email",
  version: "0.0.16",
  name: "Send Email",
  description: "Send an email to one or multiple recipients, [See the docs](https://docs.microsoft.com/en-us/graph/api/user-sendmail)",
  props: {
    microsoftOutlook,
    recipients: {
      propDefinition: [
        microsoftOutlook,
        "recipients",
      ],
    },
    ccRecipients: {
      propDefinition: [
        microsoftOutlook,
        "ccRecipients",
      ],
    },
    bccRecipients: {
      propDefinition: [
        microsoftOutlook,
        "bccRecipients",
      ],
    },
    subject: {
      propDefinition: [
        microsoftOutlook,
        "subject",
      ],
    },
    contentType: {
      propDefinition: [
        microsoftOutlook,
        "contentType",
      ],
    },
    content: {
      propDefinition: [
        microsoftOutlook,
        "content",
      ],
    },
    files: {
      propDefinition: [
        microsoftOutlook,
        "files",
      ],
    },
    expand: {
      propDefinition: [
        microsoftOutlook,
        "expand",
      ],
      description: "Additional email details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/message)",
    },
  },
  async run({ $ }) {
    await this.microsoftOutlook.sendEmail({
      $,
      data: {
        message: {
          ...await this.microsoftOutlook.prepareMessageBody(this),
          ...parseObject(this.expand),
        },
      },
    });
    $.export("$summary", "Email has been sent.");
  },
};
