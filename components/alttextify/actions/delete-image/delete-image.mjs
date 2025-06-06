import alttextify from "../../alttextify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alttextify-delete-image",
  name: "Delete Image Alt Text",
  description: "Delete the generated alt text for a specific image using the asset ID. [See the documentation](https://apidoc.alttextify.net/)",
  version: "0.0.{{ts}}",
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
    const response = await this.alttextify.deleteAltTextByAssetId({
      assetId: this.assetId,
    });

    $.export("$summary", `Successfully deleted alt text for asset ID: ${this.assetId}`);
    return response;
  },
};
