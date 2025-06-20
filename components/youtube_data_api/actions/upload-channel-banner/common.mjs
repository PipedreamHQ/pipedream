import { getFileStream } from "@pipedream/platform";

export default {
  async run({ $ }) {
    const body = await getFileStream(this.filePath);

    const params = {
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
      media: {
        body,
      },
    };

    const { data } = await this.youtubeDataApi.uploadChannelBanner(params);
    $.export("$summary", "Successfully uploaded channel banner");
    return data;
  },
};
