import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "filestack-filter-image",
  name: "Filter Image",
  description: "Applies filters such as sharpening, blurring, sepia, monochrome, and more, to an uploaded image. [See the documentation](https://www.filestack.com/docs/api/processing/#image-filters)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    sharpenAmount: {
      type: "integer",
      label: "Sharpen",
      description: "Sharpen amount to apply to the image.",
      min: 0,
      max: 20,
      optional: true,
    },
    blurAmount: {
      type: "integer",
      label: "Blur",
      description: "Blur amount to apply to the image.",
      min: 0,
      max: 20,
      optional: true,
    },
    monochrome: {
      type: "boolean",
      label: "Monochrome",
      description: "If true, converts the image to monochrome.",
      optional: true,
    },
    blackAndWhite: {
      type: "integer",
      label: "Black and White",
      description: "Black and white threshold to apply to the image.",
      min: 0,
      max: 100,
      optional: true,
    },
    sepia: {
      type: "integer",
      label: "Sepia",
      description: "Sepia tone to apply to the image.",
      min: 0,
      max: 100,
      optional: true,
    },
    pixelate: {
      type: "integer",
      label: "Pixelate",
      description: "Pixelate amount to apply to the image.",
      min: 2,
      max: 100,
      optional: true,
    },
    oilPaint: {
      type: "integer",
      label: "Oil Paint",
      description: "Oil paint amount to apply to the image.",
      min: 2,
      max: 100,
      optional: true,
    },
    negative: {
      type: "boolean",
      label: "Negative",
      description: "If true, creates a negative image by portraying the lightest area as the darkest and the darkest areas as the lightest.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTransformations() {
      const transformations = [];
      if (this.negative) transformations.push("negative");
      else {
        if (this.monochrome) transformations.push("monochrome");
        if (this.sharpenAmount) transformations.push(`sharpen=amount:${this.sharpenAmount}`);
        if (this.blurAmount) transformations.push(`blur=amount:${this.blurAmount}`);
        if (this.blackAndWhite) transformations.push(`blackwhite=threshold:${this.blackAndWhite}`);
        if (this.sepia) transformations.push(`sepia=tone:${this.sepia}`);
        if (this.pixelate) transformations.push(`pixelate=amount:${this.pixelate}`);
        if (this.oilPaint) transformations.push(`oil_paint=amount:${this.oilPaint}`);
      }

      if (!transformations.length) throw new ConfigurationError("At least one filter must be specified.");
      return transformations.join("/");
    },
  },
};
