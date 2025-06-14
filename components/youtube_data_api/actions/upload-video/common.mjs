import { getFileStream } from "@pipedream/platform";

export default {
  async run({ $ }) {
    const {
      file,
      title,
      description,
      privacyStatus,
      publishAt,
      tags,
      notifySubscribers,
    } = this;

    const body = await getFileStream(file);

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
