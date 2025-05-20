import pdforge from "../../pdforge.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pdforge-generate-pdf-from-template",
  name: "Generate PDF from Template",
  description: "Generate a document from a selected template. [See the documentation](https://docs.pdforge.com/pdfs-from-templates/synchronous-request)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pdforge,
    templateId: {
      propDefinition: [
        pdforge,
        "templateId",
      ],
    },
    data: {
      propDefinition: [
        pdforge,
        "data",
      ],
      optional: true,
    },
    convertToImage: {
      propDefinition: [
        pdforge,
        "convertToImage",
      ],
      optional: true,
    },
    s3bucket: {
      propDefinition: [
        pdforge,
        "s3bucket",
      ],
      optional: true,
    },
    s3key: {
      propDefinition: [
        pdforge,
        "s3key",
      ],
      optional: true,
    },
    webhook: {
      propDefinition: [
        pdforge,
        "webhook",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pdforge.generateDocumentFromTemplate({
      templateId: this.templateId,
      data: this.data,
      convertToImage: this.convertToImage,
      s3bucket: this.s3bucket,
      s3key: this.s3key,
      webhook: this.webhook,
    });

    if (this.webhook) {
      $.export("$summary", "Asynchronous request initiated. Await the webhook callback for completion.");
    } else {
      $.export("$summary", `PDF generated successfully from template ID: ${this.templateId}`);
    }

    return response;
  },
};
