import changePhotos from "../../change_photos.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "change_photos-transform-image",
  name: "Transform Image",
  description: "Transforms an image with various effects and optimizations. [See the documentation](https://www.change.photos/api-docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    changePhotos,
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "URL of the image to transform",
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Desired width in pixels of the output image",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Desired height in pixels of the output image",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "Output image format. Default: `jpeg`",
      options: [
        "jpeg",
        "png",
        "webp",
      ],
      optional: true,
    },
    quality: {
      type: "integer",
      label: "Quality",
      description: "Output image quality. Must be between `1` and `100`. Default: `80`",
      optional: true,
    },
    fit: {
      type: "string",
      label: "Fit",
      description: "How the image should fit within the dimensions. Default: `contain`",
      options: [
        "contain",
        "cover",
        "fill",
        "inside",
        "outside",
      ],
      optional: true,
    },
    flip: {
      type: "boolean",
      label: "Flip",
      description: "Flip the image vertically",
      optional: true,
    },
    flop: {
      type: "boolean",
      label: "Flop",
      description: "Flip the image horizontally",
      optional: true,
    },
    rotate: {
      type: "integer",
      label: "Rotate",
      description: "Rotation angle in degrees. Must be between `-360` and `360`. Default: `0`",
      optional: true,
    },
    grayscale: {
      type: "boolean",
      label: "Grayscale",
      description: "Convert image to grayscale",
      optional: true,
    },
    blur: {
      type: "string",
      label: "Blur",
      description: "Gaussian blur sigma value. Must be between `0.3` and `1000`.",
      optional: true,
    },
    sharpen: {
      type: "boolean",
      label: "Sharpen",
      description: "Apply sharpening effect",
      optional: true,
    },
    compress: {
      type: "boolean",
      label: "Compress",
      description: "Apply additional compression",
      optional: true,
    },
    tintRedComponent: {
      type: "string",
      label: "Tint - Red Component",
      description: "Red Component of the RGB tint to apply to the image. Must be between `0` and `255`.",
      optional: true,
    },
    tintGreenComponent: {
      type: "string",
      label: "Tint - Green Component",
      description: "Green Component of the RGB tint to apply to the image. Must be between `0` and `255`.",
      optional: true,
    },
    tintBlueComponent: {
      type: "string",
      label: "Tint - Blue Component",
      description: "Blue Component of the RGB tint to apply to the image. Must be between `0` and `255`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (
      (this.tintRedComponent || this.tintGreenComponent || this.tintBlueComponent)
      && !(this.tintRedComponent && this.tintGreenComponent && this.tintBlueComponent)
    ) {
      throw new ConfigurationError("Must specify Red, Green, and Blue RGB components to apply tint");
    }

    const response = await this.changePhotos.transformImage({
      $,
      data: {
        url: this.imageUrl,
        width: this.width,
        height: this.height,
        format: this.format,
        quality: this.quality,
        fit: this.fit,
        flip: this.flip,
        flop: this.flop,
        rotate: this.rotate,
        grayscale: this.grayscale,
        blur: this.blur && +this.blur,
        sharpen: this.sharpen,
        compress: this.compress,
        tint: this.tintRedComponent && {
          r: +this.tintRedComponent,
          g: +this.tintGreenComponent,
          b: +this.tintBlueComponent,
        },
      },
    });

    $.export("$summary", "Image transformed successfully");
    return response;
  },
};
