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
      propDefinition: [
        youtube,
        "fileUrl",
      ],
    },
    filePath: {
      propDefinition: [
        youtube,
        "filePath",
      ],
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
