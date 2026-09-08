// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-get-asset",
  name: "Get Asset",
  description: "Retrieve metadata for a single asset (type, name, tags, thumbnail, timestamps) via GET /assets/{assetId}. Obtain asset IDs from **Upload Asset** or **List Folder Items**. [See the documentation](https://www.canva.dev/docs/connect/api-reference/assets/get-asset/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
    const response = await this.canva.getAsset({
      $,
      assetId: this.assetId,
    });
    $.export("$summary", `Successfully retrieved asset "${response.asset?.name ?? this.assetId}"`);
    return response;
  },
};
