import alttextify from "../../alttextify.app.mjs";

export default {
  key: "alttextify-get-alttext-by-asset-id",
  name: "Retrieve Alt Text by Asset ID",
  description: "Retrieve alt text for a previously submitted image using the asset ID. [See the documentation](https://apidoc.alttextify.net/#api-Image-GetImageByAssetID)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    alttextify,
    assetId: {
      propDefinition: [
        alttextify,
        "assetId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.alttextify.retrieveAltTextByAssetId({
      $,
      assetId: this.assetId,
    });
    $.export("$summary", `Successfully retrieved alt text by Asset ID: ${this.assetId}`);

    return response;
  },
};
