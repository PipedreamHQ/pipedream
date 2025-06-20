import { getFileStream } from "@pipedream/platform";

export default {
  async run({ $ }) {
    const {
      filePath,
      title,
      description,
      privacyStatus,
      publishAt,
      tags,
      notifySubscribers,
    } = this;

    const body = await getFileStream(filePath);

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
