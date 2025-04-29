import fs from "fs";
import got from "got";
import { ConfigurationError } from "@pipedream/platform";

export default {
  async run({ $ }) {
    if ((!this.fileUrl && !this.filePath) || (this.fileUrl && this.filePath)) {
      throw new ConfigurationError("This action requires either `File URL` or `File Path`. Please enter one or the other above.");
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
