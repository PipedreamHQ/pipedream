import zohoSign from "../../zoho_sign.app.mjs";

export default {
  key: "zoho_sign-send-document",
  name: "Send Document",
  description: "Sends a document to the designated recipients for their signatures. [See the documentation](https://www.zoho.com/sign/api/#send-document-out-for-signature-using-templates)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zohoSign,
    templateId: {
      propDefinition: [
        zohoSign,
        "templateId",
      ],
    },
    quickSend: {
      type: "boolean",
      label: "Quick Send?",
      description: "Whether to send as a Quick Send",
    },
  },
  async run({ $ }) {
    const { templates } = await this.zohoSign.getTemplate({
      templateId: this.templateId,
      $,
    });

    const actions = [];
    for (const action of templates.actions) {
      actions.push({
        action_id: action.action_id,
        recipient_name: action.recipient_name,
        recipient_email: action.recipient_email,
        in_person_name: actions.recipient_name,
        verify_recipient: actions.verify_recipient,
        verification_type: actions.delivery_mode,
      });
    }

    const { requests } = await this.zohoSign.sendDocumentFromTemplate({
      templateId: this.templateId,
      data: {
        templates: {
          actions,
          field_data: {
            field_text_data: {},
            field_boolean_data: {},
            field_date_data: {},
          },
          notes: templates.notes,
        },
      },
      params: {
        is_quicksend: this.quickSend,
      },
      $,
    });

    if (requests) {
      $.export("$summary", "Successfully sent document out for signature.");
    }

    return requests;
  },
};
