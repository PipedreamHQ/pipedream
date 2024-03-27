import autobound from "../../autobound.app.mjs";

export default {
  key: "autobound-write-personalized-content",
  name: "Write Personalized Content",
  description: "Enables you to create highly customized content for individual recipients.",
  version: "0.0.1",
  type: "action",
  props: {
    autobound,
    recipientDetails: autobound.propDefinitions.recipientDetails,
    messageTemplate: {
      ...autobound.propDefinitions.messageTemplate,
      optional: true,
    },
    customizationFields: {
      ...autobound.propDefinitions.customizationFields,
      optional: true,
    },
    contentType: autobound.propDefinitions.contentType,
    customContentType: {
      ...autobound.propDefinitions.customContentType,
      optional: true,
    },
    language: {
      ...autobound.propDefinitions.language,
      optional: true,
      default: "english",
    },
  },
  async run({ $ }) {
    const response = await this.autobound.generateContent({
      recipientDetails: this.recipientDetails,
      messageTemplate: this.messageTemplate,
      customizationFields: this.customizationFields,
      contentType: this.contentType,
      customContentType: this.customContentType,
      language: this.language,
    });

    $.export("$summary", `Successfully generated personalized content for ${this.recipientDetails.email}`);
    return response;
  },
};
