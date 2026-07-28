// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-get-brand-template-dataset",
  name: "Get Brand Template Dataset",
  description: "Retrieve the data field schema for a brand template via GET /brand-templates/{brandTemplateId}/dataset. Use this to learn the field names and types before building the autofill `data` payload for **Create Design Autofill Job**. [See the documentation](https://www.canva.dev/docs/connect/api-reference/brand-templates/get-brand-template-dataset/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    brandTemplateId: {
      propDefinition: [
        canva,
        "brandTemplateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.canva.getBrandTemplateDataset({
      $,
      brandTemplateId: this.brandTemplateId,
    });
    const fieldCount = response.dataset
      ? Object.keys(response.dataset).length
      : 0;
    $.export("$summary", `Successfully retrieved dataset for brand template "${this.brandTemplateId}" (${fieldCount} field(s))`);
    return response;
  },
};
