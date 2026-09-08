// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-get-design",
  name: "Get Design",
  description: "Retrieve the full design object (id, title, owner, urls, thumbnail, page_count, timestamps) for a single Canva design. Use **List Designs** to discover design IDs. [See the documentation](https://www.canva.dev/docs/connect/api-reference/designs/get-design/).",
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
    const response = await this.canva.getDesign({
      $,
      designId: this.designId,
    });
    $.export("$summary", `Successfully retrieved design "${response.design?.title ?? this.designId}"`);
    return response;
  },
};
