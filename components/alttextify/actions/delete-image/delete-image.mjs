import alttextify from "../../alttextify.app.mjs";

export default {
  key: "alttextify-delete-image",
  name: "Delete Image Alt Text",
  description: "Delete the generated alt text for a specific image using the asset ID. [See the documentation](https://apidoc.alttextify.net/#api-Image-DeleteImage)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    alttextify,
    assetId: {
      propDefinition: [
        alttextify,
        "assetId",
      ],
      description: "The ID of the asset for retrieving or deleting alt text.",
    },
  },
  async run({ $ }) {
    const response = await this.alttextify.deleteAltTextByAssetId({
      $,
      assetId: this.assetId,
    });

    $.export("$summary", `Successfully deleted alt text for asset ID: ${this.assetId}`);
    return response;
  },
};
