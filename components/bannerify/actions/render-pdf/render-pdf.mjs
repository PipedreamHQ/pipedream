import bannerify from "../../bannerify.app.mjs";

export default {
  key: "bannerify-render-pdf",
  name: "Render PDF",
  description: "Generate a PDF from a Bannerify template and return a hosted file URL. [See the documentation](https://bannerify.co/docs/api-reference/endpoint/create-stored-pdf)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bannerify,
    templateId: {
      propDefinition: [
        bannerify,
        "templateId",
      ],
    },
    modifications: {
      propDefinition: [
        bannerify,
        "modifications",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bannerify.renderStoredPdf({
      $,
      templateId: this.templateId,
      modifications: this.modifications,
    });

    $.export("$summary", `Successfully generated PDF: ${response.url}`);

    return response;
  },
};
