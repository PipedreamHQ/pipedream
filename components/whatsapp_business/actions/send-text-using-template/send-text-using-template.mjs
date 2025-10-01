import whatsapp from "../../whatsapp_business.app.mjs";

const docLink = "https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#message-templates";
const regex = /{{\d+}}/g;

export default {
  key: "whatsapp_business-send-text-using-template",
  name: "Send Text Using Template",
  description: `Send a text message using a pre-defined template. Variables can be sent only as text. [See the docs.](${docLink})`,
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const template = await this.whatsapp.getMessageTemplate({
      templateId: this.messageTemplate.value,
    });

    for (const component of template.components) {
      if (component.type === "HEADER" && component.format === "TEXT" && component.text.match(regex)) {
        // only 1 header variable is possible
        props["header_{{1}}"] = {
          type: "string",
          label: "Header {{1}}",
          description: `Template header text: **${component.text}**`,
        };
        continue;
      }

      if (component.type === "BUTTONS") {
        for (const button of component.buttons) {
          if (button.type === "URL" && button.url.match(regex)) {
            // only 1 dynamic url button possible
            props["button_{{1}}"] = {
              type: "string",
              label: button.text,
              description: `Dynamic URL: **${button.url}** Enter the dynamic text only.`,
            };
            continue;
          }
        }
      }

      const matches = component.text?.match(regex);
      for (const match of matches ?? []) {
        props[match] = {
          type: "string",
          label: match,
          description: `Template text: **${component.text}**`,
        };
      }
    }

    return props;
  },
  async run({ $ }) {
    const components = [];
    const [
      templateName,
      language,
    ] = this.messageTemplate.label.split(" - ");

    const headerParameters = Object.keys(this)
      .filter((key) => key === "header_{{1}}")
      .map((key) => ({
        type: "text",
        text: this[key],
      }));

    if (headerParameters.length) {
      components.push({
        type: "header",
        parameters: headerParameters,
      });
    }

    const buttonParameters = Object.keys(this)
      .filter((key) => key.includes("button_"))
      .map((key) => ({
        type: "text",
        text: this[key],
      }));

    if (buttonParameters.length) {
      components.push({
        type: "button",
        sub_type: "url",
        index: 0,
        parameters: buttonParameters,
      });
    }

    const bodyParameters = Object.keys(this)
      .filter((key) => key.match(regex) && key !== "header_{{1}}" && key !== "button_{{1}}")
      .map((key) => ({
        type: "text",
        text: this[key],
      }));

    components.push({
      type: "body",
      parameters: bodyParameters,
    });

    const response = await this.whatsapp.sendMessageUsingTemplate({
      $,
      phoneNumberId: this.phoneNumberId,
      to: this.recipientPhoneNumber,
      name: templateName,
      language,
      components,
    });
    $.export("$summary", `Message sent using ${templateName} template`);
    return response;
  },
};
