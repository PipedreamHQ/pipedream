import whatsapp from "../../whatsapp_business.app.mjs";

const docLink = "https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#message-templates";
const regex = /{{\d+}}/g;

export default {
  key: "whatsapp_business-send-text-using-template",
  name: "Send Text Using Template",
  description: `Send a text message using a pre-defined template. Variables can be sent only as text. [See the docs.](${docLink})`,
  version: "0.0.7",
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
    headerVars: {
      type: "string[]",
      label: "Header Variables",
      description: "Array of header variables for programmatic/AI-agent use. Takes precedence over individual header props if provided.",
      optional: true,
    },
    bodyVars: {
      type: "string[]",
      label: "Body Variables",
      description: "Array of body variables for programmatic/AI-agent use. Takes precedence over individual body props if provided.",
      optional: true,
    },
    buttonVars: {
      type: "string[]",
      label: "Button Variables",
      description: "Array of button variables for programmatic/AI-agent use. Takes precedence over individual button props if provided.",
      optional: true,
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
    let templateName, language;

    // Handle both UI (object with label) and programmatic (string) invocation
    if (this.messageTemplate?.label) {
      const label = this.messageTemplate.label;
      const lastDashIndex = label.lastIndexOf(" - ");
      if (lastDashIndex === -1) {
        throw new Error(`Invalid template label format: "${label}". Expected format: "name - language"`);
      }
      templateName = label.substring(0, lastDashIndex);
      language = label.substring(lastDashIndex + 3);
    } else {
      // Programmatic invocation - fetch template details
      const templateId = this.messageTemplate?.value ?? this.messageTemplate;
      const template = await this.whatsapp.getMessageTemplate({
        templateId,
      });
      templateName = template.name;
      language = template.language;
    }

    // Header parameters - use headerVars array if provided, otherwise fall back to individual props
    let headerParameters;
    if (this.headerVars?.length) {
      headerParameters = this.headerVars.map((text) => ({
        type: "text",
        text,
      }));
    } else {
      headerParameters = Object.keys(this)
        .filter((key) => key === "header_{{1}}")
        .map((key) => ({
          type: "text",
          text: this[key],
        }));
    }

    if (headerParameters.length) {
      components.push({
        type: "header",
        parameters: headerParameters,
      });
    }

    // Button parameters - use buttonVars array if provided, otherwise fall back to individual props
    let buttonParameters;
    if (this.buttonVars?.length) {
      buttonParameters = this.buttonVars.map((text) => ({
        type: "text",
        text,
      }));
    } else {
      buttonParameters = Object.keys(this)
        .filter((key) => key === "button_{{1}}")
        .map((key) => ({
          type: "text",
          text: this[key],
        }));
    }

    if (buttonParameters.length) {
      components.push({
        type: "button",
        sub_type: "url",
        index: 0,
        parameters: buttonParameters,
      });
    }

    // Body parameters - use bodyVars array if provided, otherwise fall back to individual props
    let bodyParameters;
    if (this.bodyVars?.length) {
      bodyParameters = this.bodyVars.map((text) => ({
        type: "text",
        text,
      }));
    } else {
      bodyParameters = Object.keys(this)
        .filter((key) => key.match(regex) && key !== "header_{{1}}" && key !== "button_{{1}}")
        .map((key) => ({
          type: "text",
          text: this[key],
        }));
    }

    if (bodyParameters.length) {
      components.push({
        type: "body",
        parameters: bodyParameters,
      });
    }

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
