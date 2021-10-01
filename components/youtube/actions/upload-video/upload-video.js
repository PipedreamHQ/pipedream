const youtube = require("../../youtube.app.js");
const fs = require("fs");
const got = require("got");

module.exports = {
  key: "youtube-upload-video",
  name: "Upload Video",
  description: "Post a video to your channel",
  version: "0.0.1",
  type: "action",
  props: {
    youtube,
    title: {
      propDefinition: [
        youtube,
        "title",
      ],
    },
    description: {
      propDefinition: [
        youtube,
        "description",
      ],
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the video file you want to upload to YouTube. Must specify either File URL or File Path.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "Path to the video file to upload (e.g., `/tmp/myVideo.mp4`). Must specify either File URL or File Path.",
      optional: true,
    },
    privacyStatus: {
      propDefinition: [
        youtube,
        "privacyStatus",
      ],
    },
    publishAt: {
      propDefinition: [
        youtube,
        "publishAt",
      ],
    },
    tags: {
      propDefinition: [
        youtube,
        "tags",
      ],
    },
    notifySubscribers: {
      propDefinition: [
        youtube,
        "notifySubscribers",
      ],
    },
  },
  async run() {
    const body = this.fileUrl
      ? await got.stream(this.fileUrl)
      : fs.createReadStream(this.filePath);
    return await this.youtube.insertVideo({
      title: this.title,
      description: this.description,
      privacyStatus: this.privacyStatus,
      publishAt: this.publishAt,
      tags: this.tags,
      notifySubscribers: this.notifySubscribers,
      content: body,
    });
  },
};
