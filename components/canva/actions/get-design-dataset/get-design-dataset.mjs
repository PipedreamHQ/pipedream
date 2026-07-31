// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-get-design-dataset",
  name: "Get Design Dataset",
  description: "Retrieve the data field schema for a design via GET /designs/{designId}/dataset. Returns the named autofill fields (each typed `image`, `text`, or `chart`) defined by the design's data table. Use this to learn the field names and types before building the autofill `data` payload for **Create Design Autofill Job** with type `create_from_design`. [See the documentation](https://www.canva.dev/docs/connect/api-reference/designs/get-design-dataset/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    designId: {
      propDefinition: [
        canva,
        "designId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.canva.getDesignDataset({
      $,
      designId: this.designId,
    });
    const fieldCount = response.dataset
      ? Object.keys(response.dataset).length
      : 0;
    $.export("$summary", `Successfully retrieved dataset for design "${this.designId}" (${fieldCount} field(s))`);
    return response;
  },
};
