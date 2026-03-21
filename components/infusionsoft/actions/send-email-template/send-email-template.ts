import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { SendEmailTemplateParams } from "../../common/types/requestParams";

export default defineAction({
  name: "Send Email Template",
  description:
    "Send an email template to one or more contacts in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Email/operation/sendEmailTemplate)",
  key: "infusionsoft-send-email-template",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the email template to send",
      optional: false,
    },
    userId: {
      propDefinition: [
        infusionsoft,
        "userId",
      ],
    },
    contactIds: {
      type: "string[]",
      label: "Contact IDs",
      description: "List of contact IDs to send the email template to",
      optional: false,
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
  },
  async run({ $ }): Promise<object> {
    const validContactIds = (this.contactIds ?? [])
      .map((id) => String(id ?? "").trim())
      .filter((s) => s.length > 0);
    if (validContactIds.length === 0) {
      throw new Error("At least one valid contact ID is required");
    }

    const params: SendEmailTemplateParams = {
      $,
      templateId: this.templateId,
      userId: String(this.userId ?? ""),
      contactIds: validContactIds as string[],
      addressField: this.addressField,
    };

    const result = await this.infusionsoft.sendEmailTemplate(params);

    $.export(
      "$summary",
      `Successfully sent template to ${validContactIds.length} contact(s)`,
    );

    return result;
  },
});
