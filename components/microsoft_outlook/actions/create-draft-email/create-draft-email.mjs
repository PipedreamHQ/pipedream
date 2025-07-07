import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-create-draft-email",
  version: "0.0.15",
  name: "Create Draft Email",
  description: "Create a draft email, [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-post-messages)",
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
    const response =  await this.microsoftOutlook.createDraft({
      $,
      data: {
        ...await this.microsoftOutlook.prepareMessageBody(this),
        ...parseObject(this.expand),
      },
    });
    $.export("$summary", "Email draft has been created.");
    return response;
  },
};
