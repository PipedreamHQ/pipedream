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
    return await this.youtube.insertVideo({
      title,
      description,
      privacyStatus,
      publishAt,
      tags,
      notifySubscribers,
      content: body,
    });
  },
};
