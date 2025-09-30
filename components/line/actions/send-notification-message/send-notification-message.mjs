import line from "../../line.app.mjs";

export default {
  name: "Send Notification Message",
  description: "Sends notifications to users or groups from LINE Notify. [See docs](https://notify-bot.line.me/doc/en/)",
  key: "line-send-notification-message",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    line,
    accessToken: {
      label: "Access Token",
      type: "string",
      description: "The access token of a group or room. (if you do not provide this, will use your Line's account access token)",
      secret: true,
      optional: true,
    },
    message: {
      propDefinition: [
        line,
        "message",
      ],
    },
    notificationDisabled: {
      propDefinition: [
        line,
        "notificationDisabled",
      ],
    },
    imageThumbnail: {
      label: "Image Thumbnail",
      type: "string",
      description: "The image that will be displayed on notification thumbnail. Maximum size of 240×240px JPEG. E.g. `https://test-bucket-from-leo.s3.us-east-1.amazonaws.com/github_dark.png`",
      optional: true,
    },
    imageFullsize: {
      label: "Image Fullsize",
      type: "string",
      description: "The image that will be displayed on open the notification. Maximum size of 2048×2048px JPEG. E.g. `https://test-bucket-from-leo.s3.us-east-1.amazonaws.com/github_dark.png`",
      optional: true,
    },
    stickerPackageId: {
      label: "Sticker Package ID",
      type: "string",
      description: "The ID of a package of stickers to be send on notification. (see Line's [List of Stickers](https://developers.line.biz/en/docs/messaging-api/sticker-list))",
      optional: true,
    },
    stickerId: {
      label: "Sticker ID",
      type: "string",
      description: "The ID of a sticker to be send on notification.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      message,
      imageThumbnail,
      imageFullsize,
      stickerPackageId,
      stickerId,
    } = this;

    if ((!!imageThumbnail && !imageFullsize) || (!imageThumbnail && !!imageFullsize)) {
      throw new Error("You need set the Image Fullsize and Image Thumbnail together.");
    }

    return this.line.sendNotification($, {
      message,
      imageThumbnail,
      imageFullsize,
      stickerPackageId,
      stickerId,
    }, this.accessToken);
  },
};
