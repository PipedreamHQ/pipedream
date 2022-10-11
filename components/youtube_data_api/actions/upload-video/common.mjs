import fs from "fs";
import got from "got";

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
    if (!fileUrl && !filePath) {
      throw new Error("This action requires either File URL or File Path. Please enter one or the other above.");
    }
    const body = fileUrl
      ? await got.stream(fileUrl)
      : fs.createReadStream(filePath);
    const resp = (await this.youtubeDataApi.insertVideo({
      title,
      description,
      privacyStatus,
      publishAt,
      tags,
      notifySubscribers,
      content: body,
    })).data;
    $.export("$summary", `Successfully uploaded a new video, "${title}"`);
    return resp;
  },
};
