import fs from "fs";
import got from "got@12.4.1";

export default {
  async run({ $ }) {
    if (!this.fileUrl && !this.filePath) {
      throw new Error("This action requires either File URL or File Path. Please enter one or the other above.");
    }

    const body = this.fileUrl
      ? await got.stream(this.fileUrl)
      : fs.createReadStream(this.filePath);
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
