// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-delete-asset",
  name: "Delete Asset",
  description: "Permanently delete an asset via DELETE /assets/{assetId}. This is irreversible. [See the documentation](https://www.canva.dev/docs/connect/api-reference/assets/delete-asset/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
