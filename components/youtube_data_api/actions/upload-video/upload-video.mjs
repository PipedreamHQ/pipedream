import youtubeDataApi from "../../youtube_data_api.app.mjs";
import fs from "fs";
import got from "got";

export default {
  key: "youtube_data_api-upload-video",
  name: "Upload Video",
  description: "Post a video to your channel. [See the docs](https://developers.google.com/youtube/v3/docs/videos/insert) for more information",
  version: "0.0.2",
  type: "action",
  props: {
    youtubeDataApi,
    title: {
      propDefinition: [
        youtubeDataApi,
        "title",
      ],
    },
    description: {
      propDefinition: [
        youtubeDataApi,
        "description",
      ],
    },
    fileUrl: {
      propDefinition: [
        youtubeDataApi,
        "fileUrl",
      ],
    },
    filePath: {
      propDefinition: [
        youtubeDataApi,
        "filePath",
      ],
    },
    privacyStatus: {
      propDefinition: [
        youtubeDataApi,
        "privacyStatus",
      ],
    },
    publishAt: {
      propDefinition: [
        youtubeDataApi,
        "publishAt",
      ],
    },
    tags: {
      propDefinition: [
        youtubeDataApi,
        "tags",
      ],
    },
    notifySubscribers: {
      propDefinition: [
        youtubeDataApi,
        "notifySubscribers",
      ],
    },
  },
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
