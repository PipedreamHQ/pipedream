import adobePhotoshop from "../../adobe_photoshop.app.mjs";
import {
  MASK_FORMAT_OPTIONS,
  OPTIMIZE_OPTIONS,
  STORAGE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "adobe_photoshop-remove-background-from-image",
  name: "Remove Background from Image",
  description: "Removes the background from an image using Adobe Photoshop API. [See the documentation](https://developer.adobe.com/firefly-services/docs/photoshop/api/photoshop_removeBackground/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    adobePhotoshop,
    inputHref: {
      type: "string",
      label: "Input Href",
      description: "Any public url or a presignedURL for the asset input.",
    },
    inputStorage: {
      type: "string",
      label: "Input Storage",
      description: "Asset stored on an external service (like AWS S3, Azure, Dropbox).",
      options: STORAGE_OPTIONS,
      default: "external",
    },
    optimize: {
      type: "string",
      label: "Optimize",
      description: "The value 'performance' optimizes for speed. 'batch' ensures the job will ultimately run regardless of wait time.",
      optional: true,
      options: OPTIMIZE_OPTIONS,
    },
    outputHref: {
      type: "string",
      label: "Output Href",
      description: "Any public url or a presignedURL for the asset output.",
    },
    outputStorage: {
      type: "string",
      label: "Output Storage",
      description: "Asset stored on an external service (like AWS S3, Azure, Dropbox).",
      options: STORAGE_OPTIONS,
      default: "external",
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite",
      description: "If the file already exists, indicates if the output file should be overwritten. Only applies to files stored in Adobe storage.",
      optional: true,
    },
    maskFormat: {
      type: "string",
      label: "Mask Format",
      description: "A soft (feathered) mask or binary mask.",
      options: MASK_FORMAT_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      input: {
        href: this.inputHref,
        storage: this.inputStorage,
      },
      options: {
        optimize: this.optimize,
      },
      output: {
        href: this.outputHref,
        storage: this.outputStorage,
        overwrite: this.overwrite,
      },
    };

    if (this.maskFormat) {
      data.output.mask = {
        format: this.maskFormat,
      };
    }

    const response = await this.adobePhotoshop.removeBackground({
      $,
      data,
    });

    $.export("$summary", "Successfully removed background from the image");
    return response;
  },
};
