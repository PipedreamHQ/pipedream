import line from "../../line.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "Send a Notification Message",
  description: "Sends notifications to users or groups from LINE Notify",
  key: "line-send-a-notification-message",
  version: "0.0.1",
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
      description: "The image that will be displayed on notification thumbnail. Maximum size of 240×240px JPEG",
      optional: true,
    },
    imageFullsize: {
      label: "Image Fullsize",
      type: "string",
      description: "The image that will be displayed on open the notification. Maximum size of 2048×2048px JPEG",
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

    const body = {
      message,
      imageThumbnail,
      imageFullsize,
      stickerPackageId,
      stickerId,
    };

    if (this.imageThumbnail) body.imageThumbnail = this.imageThumbnail;
    if (this.imageFullsize) body.imageFullsize = this.imageFullsize;
    if (this.stickerPackageId) body.stickerPackageId = this.stickerPackageId;
    if (this.stickerId) body.stickerId = this.stickerId;

    return await axios($, {
      url: "https://notify-api.line.me/api/notify",
      method: "post",
      data: this.line.convertJSONToUrlEncodec(body),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${this.accessToken ?? this.line.$auth.oauth_access_token}`,
      },
    });
  },
};
