import vimeo from "../../vimeo.app.mjs";

export default {
  key: "vimeo-add-video-to-album",
  name: "Add Video To Album",
  description: "Adds an existing video to a user's album on Vimeo",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vimeo,
    videoId: vimeo.propDefinitions.videoId,
    albumId: vimeo.propDefinitions.albumId,
  },
  async run({ $ }) {
    const response = await this.vimeo.addVideoToAlbum(this.videoId, this.albumId);
    $.export("$summary", `Successfully added video ${this.videoId} to album ${this.albumId}`);
    return response;
  },
};
