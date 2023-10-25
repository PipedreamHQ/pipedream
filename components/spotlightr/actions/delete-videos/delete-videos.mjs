import spotlightr from "../../spotlightr.app.mjs";

export default {
  key: "spotlightr-delete-videos",
  name: "Delete Videos",
  version: "0.0.1",
  description: "Delete videos from your account. [See the documentation](https://app.spotlightr.com/docs/api/#deleteVideo)",
  type: "action",
  props: {
    spotlightr,
    videoId: {
      propDefinition: [
        spotlightr,
        "videoId",
      ],
      type: "string[]",
    },
  },
  async run({ $ }) {
    const {
      spotlightr,
      videoId,
    } = this;

    const response = await spotlightr.deleteVideo({
      $,
      params: {
        IDs: videoId,
      },
    });

    $.export("$summary", `The videos with Ids: ${videoId.toString()} were successfully deleted!`);
    return response;
  },
};
