// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-get-brand-template",
  name: "Get Brand Template",
  description: "Retrieve details (id, title, view_url, create_url, thumbnail, timestamps) for a single brand template via GET /brand-templates/{brandTemplateId}. Use **List Brand Templates** to discover IDs. [See the documentation](https://www.canva.dev/docs/connect/api-reference/brand-templates/get-brand-template/).",
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
    const response = await this.canva.getBrandTemplate({
      $,
      brandTemplateId: this.brandTemplateId,
    });
    $.export("$summary", `Successfully retrieved brand template "${response.brand_template?.title ?? this.brandTemplateId}"`);
    return response;
  },
};
