import common from "../common/common.mjs";

export default {
  ...common,
  key: "filestack-rotate-image",
  name: "Rotate Image",
  description: "Rotates an uploaded image by a specified degree. [See the documentation](https://www.filestack.com/docs/api/processing/#rotate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    degrees: {
      type: "integer",
      label: "Degrees",
      description: "How much to rotate the image in degrees, clockwise from 0 degrees (no rotation) to 359 (nearly all the way around).",
      min: 0,
      max: 359,
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return `Image rotated successfully by ${this.degrees} degrees`;
    },
    getTransformations() {
      return `rotate=deg:${this.degrees}`;
    },
  },
};
