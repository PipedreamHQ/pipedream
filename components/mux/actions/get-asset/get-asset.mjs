import mux from "../../mux.app.mjs";

export default {
  key: "mux-get-asset",
  name: "Get Asset or Livestream ID",
  description: "Retrieves an asset. [See the documentation](https://docs.mux.com/api-reference#video/operation/get-asset)",
  version: "0.0.1",
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
      playbackId: this.assetId,
    });
    if (data?.tracks) {
      $.export("$summary", `Successfully retrieved tracks for asset: ${data.tracks}`);
    }
    return data;
  },
};
