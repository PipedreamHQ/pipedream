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
      withLabel: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const allMatches = [];
    const regex = /{{\d+}}/g;
    const template = await this.whatsapp.getMessageTemplate({
      templateId: this.messageTemplate.value,
    });
    for (const component of template.components) {
      const matches = component.text?.match(regex);
      for (const match of matches ?? []) {
        allMatches.push({
          variable: match,
          description: component.text,
        });
      }
    }
    for (const match of allMatches) {
      props[match.variable] = {
        type: "string",
        label: match.variable,
        description: `Template text: **${match.description}**`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.whatsapp.sendMessageUsingTemplate({
      $,
      phoneNumberId: this.phoneNumberId,
      to: this.recipientPhoneNumber,
      name: this.messageTemplate.label,
    });
    $.export("$summary", `Message sent using ${this.messageTemplate.label} template`);
    return response;
  },
};
