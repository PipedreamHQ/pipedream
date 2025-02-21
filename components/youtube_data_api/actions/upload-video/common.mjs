import fs from "fs";
import got from "got";
import { ConfigurationError } from "@pipedream/platform";

export default {
  async run({ $ }) {
    const {
      fileUrl,
      filePath,
      title,
      description,
      privacyStatus,
      publishAt,
      tags,
      notifySubscribers,
    } = this;
    if ((!fileUrl && !filePath) || (fileUrl && filePath)) {
      throw new ConfigurationError("This action requires either `File URL` or `File Path`. Please enter one or the other above.");
    }
    const body = fileUrl
      ? await got.stream(fileUrl)
      : fs.createReadStream(filePath);
    const { data: resp } = await this.youtubeDataApi.insertVideo({
      title,
      description,
      privacyStatus,
      publishAt,
      tags,
      notifySubscribers,
      content: body,
    });
    $.export("$summary", `Successfully uploaded a new video, "${title}"`);
    return resp;
  },
};
