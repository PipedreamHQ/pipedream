import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { SendEmailParams } from "../../types/requestParams";

export default defineAction({
  name: "Send Email",
  description:
    "Send an email to one or more contacts in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Email/operation/sendEmail)",
  key: "infusionsoft-send-email",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    userId: {
      propDefinition: [
        infusionsoft,
        "userId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject line of the email",
      optional: false,
    },
    contactIds: {
      type: "string[]",
      label: "Contact IDs",
      description: "List of contact IDs to send the email to",
      optional: false,
    },
    htmlContent: {
      type: "string",
      label: "HTML Content",
      description: "The HTML-formatted content of the email. Will be Base64 encoded automatically",
      optional: true,
    },
    plainContent: {
      type: "string",
      label: "Plain Text Content",
      description: "The plain-text content of the email. Will be Base64 encoded automatically",
      optional: true,
    },
    addressField: {
      type: "string",
      label: "Address Field",
      description: "Email field of each Contact to address the email to",
      optional: true,
      options: [
        {
          label: "Primary Email (EMAIL1)",
          value: "EMAIL1",
        },
        {
          label: "Email 2 (EMAIL2)",
          value: "EMAIL2",
        },
        {
          label: "Email 3 (EMAIL3)",
          value: "EMAIL3",
        },
      ],
    },
    attachments: {
      type: "string",
      label: "Attachments",
      description:
        "JSON array of attachment objects with file_name and file_data (Base64). Example: [{\"file_name\": \"doc.pdf\", \"file_data\": \"base64string\"}]",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const validContactIds = (this.contactIds ?? [])
      .map((id) => String(id ?? "").trim())
      .filter((s) => s.length > 0);
    if (validContactIds.length === 0) {
      throw new Error("At least one valid contact ID is required");
    }

    const params: SendEmailParams = {
      $,
      userId: String(this.userId ?? ""),
      subject: this.subject,
      contactIds: validContactIds,
      htmlContent: this.htmlContent,
      plainContent: this.plainContent,
      addressField: this.addressField,
      attachments: this.attachments,
    };

    const result = await this.infusionsoft.sendEmail(params);

    $.export(
      "$summary",
      `Successfully sent email to ${validContactIds.length} contact(s)`,
    );

    return result;
  },
});
