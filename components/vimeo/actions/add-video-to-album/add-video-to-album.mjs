import vimeo from "../../vimeo.app.mjs";

export default {
  key: "vimeo-add-video-to-album",
  name: "Add Video To Album",
  description: "Adds an existing video to a user's album/showcase on Vimeo. [See the documentation](https://developer.vimeo.com/api/reference/showcases#update_showcases)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vimeo,
    videoId: {
      propDefinition: [
        vimeo,
        "videoId",
      ],
    },
    albumUri: {
      propDefinition: [
        vimeo,
        "albumUri",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vimeo.addVideoToAlbum({
      $,
      videoId: this.videoId,
      data: {
        add: [
          {
            uri: this.albumUri,
          },
        ],
      },
    });
    $.export("$summary", `Successfully added video ${this.videoId} to album ${this.albumUri}`);
    return response;
  },
};
