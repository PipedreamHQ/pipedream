// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-delete-asset",
  name: "Delete Asset",
  description: "Move an asset to Trash via DELETE /assets/{assetId}. The asset is moved to the Canva Trash and can be recovered from there — it is not permanently deleted. [See the documentation](https://www.canva.dev/docs/connect/api-reference/assets/delete-asset/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    assetId: {
      propDefinition: [
        canva,
        "assetId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.canva.deleteAsset({
      $,
      assetId: this.assetId,
    });
    $.export("$summary", `Successfully deleted asset "${this.assetId}"`);
    return response;
  },
};
