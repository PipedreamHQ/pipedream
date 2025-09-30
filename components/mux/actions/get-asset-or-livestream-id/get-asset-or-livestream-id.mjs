import mux from "../../mux.app.mjs";

export default {
  key: "mux-get-asset-or-livestream-id",
  name: "Get Asset or Livestream ID",
  description: "Returns an Asset or Livestream ID from a Playback ID. [See the documentation](https://docs.mux.com/api-reference#video/operation/get-asset-or-livestream-id)",
  version: "0.0.2",
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
      optional: true,
    },
    playbackId: {
      propDefinition: [
        mux,
        "playbackId",
        (c) => ({
          assetId: c.assetId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.mux.getAssetOrLivestreamId({
      $,
      playbackId: this.playbackId,
    });
    if (data?.object) {
      $.export("$summary", `Successfully retrieved asset or livestream ID: ${data.object.id}`);
    }
    return data;
  },
};
