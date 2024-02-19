import rkvst from "../../rkvst.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rkvst-create-asset",
  name: "Create Asset",
  description: "Allows for the addition of a new asset into the RKVST system. [See the documentation](https://docs.datatrails.ai/developers/api-reference/assets-api/)",
  version: "0.0.1",
  type: "action",
  props: {
    rkvst,
    newAssetData: {
      propDefinition: [
        rkvst,
        "newAssetData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rkvst.createAsset({
      newAssetData: this.newAssetData,
    });
    $.export("$summary", `Successfully created new asset with ID ${response.asset_identity}`);
    return response;
  },
};
