import app from "../../roblox.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "roblox-generate-user-thumbnail",
  name: "Generate User Thumbnail",
  description: "Generate a thumbnail image for a Roblox user's avatar. [See the documentation](https://create.roblox.com/docs/cloud/reference/User#Cloud_GenerateUserThumbnail)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    size: {
      type: "integer",
      label: "Size",
      description: "The size, in pixels, of the square thumbnail. Defaults to `420`.",
      options: constants.THUMBNAIL_SIZES,
      optional: true,
      default: constants.THUMBNAIL_DEFAULT_SIZE,
    },
    format: {
      type: "string",
      label: "Format",
      description: "The image format of the generated thumbnail. Defaults to `PNG`.",
      options: constants.THUMBNAIL_FORMATS,
      optional: true,
      default: constants.THUMBNAIL_DEFAULT_FORMAT,
    },
    shape: {
      type: "string",
      label: "Shape",
      description: "The shape of the generated thumbnail. Defaults to `ROUND`.",
      options: constants.THUMBNAIL_SHAPES,
      optional: true,
      default: constants.THUMBNAIL_DEFAULT_SHAPE,
    },
  },
  async run({ $ }) {
    const response = await this.app.generateUserThumbnail({
      $,
      userId: this.userId,
      params: {
        size: this.size,
        format: this.format,
        shape: this.shape,
      },
    });
    const imageUri = response.response?.imageUri;
    $.export("$summary", response.done
      ? `Generated thumbnail for user ${this.userId}`
      : `Thumbnail generation for user ${this.userId} is pending`);
    return {
      imageUri,
      ...response,
    };
  },
};
