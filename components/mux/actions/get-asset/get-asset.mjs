import mux from "../../mux.app.mjs";

export default {
  key: "mux-get-asset",
  name: "Get Asset",
  description: "Retrieves an asset. [See the documentation](https://docs.mux.com/api-reference#video/operation/get-asset)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mux,
    assetId: {
      propDefinition: [
        mux,
        "assetId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.mux.getAsset({
      $,
      assetId: this.assetId,
    });
    if (data?.tracks) {
      $.export("$summary", `Successfully retrieved asset: ${data.id}`);
    }
    return data;
  },
};
