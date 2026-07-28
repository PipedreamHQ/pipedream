// x-pd-ai: optimized
import canva from "../../canva.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "canva-create-design",
  name: "Create Design",
  description: "Creates a new Canva design. [See the documentation](https://www.canva.dev/docs/connect/api-reference/designs/create-design/)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    canva,
    designType: {
      type: "string",
      label: "Design Type",
      description: "The desired design type",
      options: constants.DESIGN_TYPE_OPTIONS,
    },
    name: {
      type: "string",
      label: "Design Type Name",
      description: "The name of the design type. Only applies when Design Type is `preset`.",
      optional: true,
      options: constants.DESIGN_TYPE_NAME_OPTIONS,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the design (in pixels). Minimum 40px, maximum 8000px. Only applies when Design Type is `custom`.",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the design (in pixels). Minimum 40px, maximum 8000px. Only applies when Design Type is `custom`.",
      optional: true,
    },
    title: {
      propDefinition: [
        canva,
        "title",
      ],
      optional: true,
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The ID of the asset to add to the new design",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.canva.createDesign({
      $,
      data: {
        design_type: {
          type: this.designType,
          name: this.name,
          width: this.width,
          height: this.height,
        },
        title: this.title,
        asset_id: this.assetId,
      },
    });
    $.export("$summary", `Created design with ID: ${response.design.id}`);
    return response;
  },
};
