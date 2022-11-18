import whatsapp from "../../whatsapp_business.app.mjs";

export default {
  key: "whatsapp_business-send-text-using-template",
  name: "Send Text Using Template",
  description: "Send a text message using a pre-defined template",
  version: "0.0.1",
  type: "action",
  props: {
    whatsapp,
    phoneNumberId: {
      propDefinition: [
        whatsapp,
        "phoneNumberId",
      ],
    },
    recipientPhoneNumber: {
      propDefinition: [
        whatsapp,
        "recipientPhoneNumber",
      ],
    },
    messageTemplate: {
      propDefinition: [
        whatsapp,
        "messageTemplate",
      ],
      description: `${whatsapp.propDefinitions.messageTemplate.description}
        Currently, it will only work if the template has no variables.`,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language for the template that will be sent. Defaults to `en_US`.",
      optional: true,
      default: "en_US",
    },
  },
  async run({ $ }) {
    const response = await this.whatsapp.sendMessageUsingTemplate({
      $,
      phoneNumberId: this.phoneNumberId,
      to: this.recipientPhoneNumber,
      name: this.messageTemplate,
      language: this.language,
    });
    $.export("$summary", `Message sent using ${this.messageTemplate} template`);
    return response;
  },
};
