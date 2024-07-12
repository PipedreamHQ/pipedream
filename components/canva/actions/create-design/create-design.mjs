import canva from "../../canva.app.mjs";

export default {
  key: "canva-create-design",
  name: "Create Design",
  description: "Creates a new Canva design. You can either use a preset design type or set height and width dimensions for a custom design. Additionally, you can provide the `asset_id` of an asset in the user's projects to add to the new design.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    canva,
    presetDesignType: {
      ...canva.propDefinitions.presetDesignType,
      optional: true,
    },
    customHeight: {
      ...canva.propDefinitions.customHeight,
      optional: true,
    },
    customWidth: {
      ...canva.propDefinitions.customWidth,
      optional: true,
    },
    assetId: {
      ...canva.propDefinitions.assetId,
      optional: true,
    },
  },
  async run({ $ }) {
    const designType = this.presetDesignType
      ? {
        type: "preset",
        name: this.presetDesignType,
      }
      : {
        type: "custom",
        height: this.customHeight,
        width: this.customWidth,
      };
    const response = await this.canva.createDesign({
      presetDesignType: designType,
      assetId: this.assetId,
    });
    $.export("$summary", `Created design with ID: ${response.design.id}`);
    return response;
  },
};
