import common from "../common/common.mjs";

export default {
  ...common,
  key: "filestack-resize-image",
  name: "Resize Image",
  description:
    "Resizes an uploaded image to specified width and height. [See the documentation](https://www.filestack.com/docs/api/processing/#resize)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
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
  methods: {
    ...common.methods,
    getSummary() {
      return `Image resized successfully to ${this.width}x${this.height}`;
    },
    getTransformations() {
      const transformations = [
        `resize=height:${this.height}`,
        `width:${this.width}`,
      ];
      if (this.mode) transformations.push(`,fit:${this.mode}`);
      return transformations.join();
    },
  },
};
