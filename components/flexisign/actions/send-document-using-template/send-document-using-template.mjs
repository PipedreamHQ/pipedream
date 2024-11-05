import flexisign from "../../flexisign.app.mjs";

export default {
  key: "flexisign-send-document-using-template",
  name: "Send Document Using Template",
  description: "Sends a signature request to the specified recipients for a document generated from a template. [See the documentation](https://flexisign.io/app/integrations/flexisignapi)",
  version: "0.0.1",
  type: "action",
  props: {
    flexisign,
    templateId: {
      propDefinition: [
        flexisign,
        "templateId",
      ],
    },
    recipients: {
      propDefinition: [
        flexisign,
        "recipients",
      ],
    },
    message: {
      propDefinition: [
        flexisign,
        "message",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.flexisign.sendSignatureRequest({
      templateId: this.templateId,
      recipients: this.recipients,
      message: this.message,
    });

    $.export("$summary", `Signature request sent for template ID: ${this.templateId}`);
    return response;
  },
};
