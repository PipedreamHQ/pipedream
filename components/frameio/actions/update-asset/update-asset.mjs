import frameio from "../../frameio.app.mjs";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "frameio-update-asset",
  name: "Update Asset",
  description: "Modifies an existing asset in Frame.io. [See the documentation](https://developer.frame.io/api/reference/operation/updateasset/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    frameio,
    assetId: frameio.propDefinitions.assetId,
    updateValues: frameio.propDefinitions.updateValues,
  },
  async run({ $ }) {
    const response = await this.frameio.modifyAsset({
      assetId: this.assetId,
      updateValues: this.updateValues,
    });
    $.export("$summary", `Successfully updated asset with ID ${this.assetId}`);
    return response;
  },
});
