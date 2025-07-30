import { getFileStream } from "@pipedream/platform";

export default {
  async run({ $ }) {
    const body = await getFileStream(this.filePath);

    const params = {
      videoId: this.videoId,
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
      media: {
        body,
      },
    };

    const { data } = await this.youtubeDataApi.uploadThumbnail(params);
    $.export("$summary", `Successfully uploaded thumbnail to video with ID ${this.videoId}`);
    return data;
  },
};
