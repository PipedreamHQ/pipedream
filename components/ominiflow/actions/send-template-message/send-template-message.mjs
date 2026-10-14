import ominiflow from "../../ominiflow.app.mjs";

export default {
  key: "ominiflow-send-template-message",
  name: "Send WhatsApp Template Message",
  description: "Send an approved Meta WhatsApp template with dynamic variables to a contact",
  version: "0.0.1",
  type: "action",
  props: {
    ominiflow,
    phone: {
      type: "string",
      label: "Recipient Phone Number",
      description: "The phone number with country code (e.g. `+919876543210`).",
    },
    templateName: {
      propDefinition: [ominiflow, "templateName"],
    },
    templateLanguage: {
      type: "string",
      label: "Language Code",
      description: "Language of the template (e.g. `en`, `en_US`, `hi`).",
      default: "en",
    },
    bodyParameters: {
      type: "string[]",
      label: "Body Variables ({{1}}, {{2}}, ...)",
      description: "Ordered values for template placeholder variables in the body text.",
      optional: true,
    },
  },
  async run({ $ }) {
    const components = [];

    if (Array.isArray(this.bodyParameters) && this.bodyParameters.length > 0) {
      components.push({
        type: "body",
        parameters: this.bodyParameters.map((val) => ({
          type: "text",
          text: String(val),
        })),
      });
    }

    const response = await this.ominiflow.sendTemplateMessage({
      $,
      phone: this.phone,
      templateName: this.templateName,
      templateLanguage: this.templateLanguage,
      components,
    });

    if (response?.status === "error") {
      throw new Error(`Ominiflow error: ${response.message || response.errors || "Failed to send template"}`);
    }

    $.export("$summary", `Template "${this.templateName}" sent successfully to ${this.phone}`);
    return response;
  },
};
