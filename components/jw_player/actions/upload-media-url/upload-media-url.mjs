import jw_player from "../../jw_player.app.mjs";

export default {
  key: "jw_player-upload-media-url",
  name: "Upload Media URL",
  description: "Uploads a media file to JW Player from a provided URL. [See the documentation](https://docs.jwplayer.com/platform/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    jw_player,
    methodType: {
      ...jw_player.propDefinitions.methodType,
      description: "Method for uploading the media from a URL (fetch or external)",
    },
    mediaSource: {
      ...jw_player.propDefinitions.mediaSource,
      description: "The URL of the source media to upload",
    },
  },
  async run({ $ }) {
    const response = await this.jw_player.createMedia({
      methodType: this.methodType,
      mediaSource: this.mediaSource,
    });
    $.export("$summary", `Successfully uploaded media from URL: ${this.mediaSource}`);
    return response;
  },
};
