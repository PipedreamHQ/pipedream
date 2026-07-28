// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import canva from "../../canva.app.mjs";

export default {
  key: "canva-update-asset",
  name: "Update Asset",
  description: "Update an asset's name and/or tags via PATCH /assets/{assetId}. At least one of name or tags should be provided. [See the documentation](https://www.canva.dev/docs/connect/api-reference/assets/update-asset/).",
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
    name: {
      type: "string",
      label: "Name",
      description: "New asset name (max 50 characters).",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Replacement list of tags for the asset (max 50 items).",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.name == null && this.tags == null) {
      throw new ConfigurationError("Provide at least one of Name or Tags to update.");
    }

    const response = await this.canva.updateAsset({
      $,
      assetId: this.assetId,
      data: {
        name: this.name,
        tags: this.tags,
      },
    });
    $.export("$summary", `Successfully updated asset "${this.assetId}"`);
    return response;
  },
};
