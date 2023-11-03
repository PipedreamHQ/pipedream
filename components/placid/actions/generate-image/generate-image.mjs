import placid from "../../placid.app.mjs";

export default {
  key: "placid-generate-image",
  name: "Generate Image",
  description: "Generate a new image based on a specified template. [See the documentation](https://placid.app/docs/2.0/rest/images)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    placid,
    templateId: {
      propDefinition: [
        placid,
        "templateId",
      ],
    },
    layers: {
      propDefinition: [
        placid,
        "layers",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.placid.createImage({
      templateId: this.templateId,
      layers: this.layers,
    });
    $.export("$summary", `Successfully generated image with ID: ${response.id}`);
    return response;
  },
};
