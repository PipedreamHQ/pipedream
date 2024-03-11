import filestack from "../../filestack.app.mjs";

export default {
  key: "filestack-resize-image",
  name: "Resize Image",
  description:
    "Resizes an uploaded image to specified width and height. [See the documentation](https://www.filestack.com/docs/api/processing/#resize)",
  version: "0.0.1",
  type: "action",
  props: {
    filestack,
    uploadedImageUrl: {
      propDefinition: [
        filestack,
        "uploadedImageUrl",
      ],
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width to resize the image to, in pixels.",
      min: 1,
      max: 10000,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height to resize the image to, in pixels.",
      min: 1,
      max: 10000,
    },
    mode: {
      type: "string",
      label: "Mode",
      description:
        "The possible methods by which the image should fit the specified dimensions.",
      optional: true,
      options: [
        {
          value: "clip",
          label:
            "Preserving the aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified",
        },
        {
          value: "crop",
          label:
            "Preserving the aspect ratio, ensure the image covers both provided dimensions by clipping/cropping to fit",
        },
        {
          value: "max",
          label:
            "Do not enlarge if the dimensions of the provided image are already less than the specified width or height",
        },
        {
          value: "scale",
          label:
            "Ignore the aspect ratio of the provided image and stretch to both provided dimensions",
        },
      ],
    },
  },
  async run({ $ }) {
    const {
      uploadedImageUrl, width, height, mode,
    } = this;
    let transformations = `resize=height:${height},width:${width}`;
    if (mode) transformations += `,fit:${mode}`;
    const response = await this.filestack.transformImage({
      $,
      uploadedImageUrl,
      transformations,
    });

    $.export(
      "$summary",
      `Image resized successfully to ${width}x${height}`,
    );
    return response;
  },
};
