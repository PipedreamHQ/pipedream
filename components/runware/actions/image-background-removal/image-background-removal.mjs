import { ConfigurationError } from "@pipedream/platform";
import { v4 as uuid } from "uuid";
import app from "../../runware.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "runware-image-background-removal",
  name: "Image Background Removal",
  description: "Request an image background removal task to be processed by the Runware API. [See the documentation](https://docs.runware.ai/en/image-editing/background-removal).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    inputImage: {
      propDefinition: [
        app,
        "inputImage",
      ],
    },
    outputType: {
      propDefinition: [
        app,
        "outputType",
      ],
    },
    outputFormat: {
      propDefinition: [
        app,
        "outputFormat",
      ],
    },
    includeCost: {
      propDefinition: [
        app,
        "includeCost",
      ],
    },
    rgb: {
      type: "string[]",
      label: "RGB",
      description: "An array representing the `[red, green, blue]` values that define the color of the removed background. Eg. `[255, 255, 255]`.",
      optional: true,
    },
    postProcessMask: {
      type: "boolean",
      label: "Post-Process Mask",
      description: "Flag indicating whether to post-process the mask. Controls whether the mask should undergo additional post-processing. This step can improve the accuracy and quality of the background removal mask.",
      optional: true,
    },
    returnOnlyMask: {
      type: "boolean",
      label: "Return Only Mask",
      description: "Flag indicating whether to return only the mask. The mask is the opposite of the image background removal.",
      optional: true,
    },
    alphaMatting: {
      type: "boolean",
      label: "Alpha Matting",
      description: "Flag indicating whether to use alpha matting. Alpha matting is a post-processing technique that enhances the quality of the output by refining the edges of the foreground object.",
      optional: true,
    },
    alphaMattingForegroundThreshold: {
      type: "integer",
      label: "Alpha Matting Foreground Threshold",
      description: "Threshold value used in alpha matting to distinguish the foreground from the background. Adjusting this parameter affects the sharpness and accuracy of the foreground object edges. Eg. `240`.",
      optional: true,
      min: 1,
      max: 255,
    },
    alphaMattingBackgroundThreshold: {
      type: "integer",
      label: "Alpha Matting Background Threshold",
      description: "Threshold value used in alpha matting to refine the background areas. It influences how aggressively the algorithm removes the background while preserving image details. The higher the value, the more computation is needed and therefore the more expensive the operation is. Eg. `10`.",
      optional: true,
      min: 1,
      max: 255,
    },
    alphaMattingErodeSize: {
      type: "integer",
      label: "Alpha Matting Erode Size",
      description: "Specifies the size of the erosion operation used in alpha matting. Erosion helps in smoothing the edges of the foreground object for a cleaner removal of the background. Eg. `10`.",
      optional: true,
      min: 1,
      max: 255,
    },
  },
  methods: {
    getRGBA(rgb, alpha = 0) {
      if (rgb) {
        const parsed = utils.parseArray(rgb).map((value) => parseInt(value, 10));
        return parsed.concat(alpha);
      }
    },
  },
  async run({ $ }) {
    const {
      app,
      getRGBA,
      inputImage,
      outputType,
      outputFormat,
      includeCost,
      rgb,
      postProcessMask,
      returnOnlyMask,
      alphaMatting,
      alphaMattingForegroundThreshold,
      alphaMattingBackgroundThreshold,
      alphaMattingErodeSize,
    } = this;

    if (rgb && utils.parseArray(rgb).length !== 3) {
      throw new ConfigurationError("The **RGB** array must contain exactly 3 integer numbers. Eg. `[255, 255, 255]`.");
    }

    const response = await app.post({
      $,
      data: [
        {
          taskType: constants.TASK_TYPE.IMAGE_BACKGROUND_REMOVAL.value,
          taskUUID: uuid(),
          inputImage,
          outputType,
          outputFormat,
          includeCost,
          rgba: getRGBA(rgb),
          postProcessMask,
          returnOnlyMask,
          alphaMatting,
          alphaMattingForegroundThreshold,
          alphaMattingBackgroundThreshold,
          alphaMattingErodeSize,
        },
      ],
    });

    $.export("$summary", `Successfully requested image background removal task with UUID \`${response.data[0].taskUUID}\`.`);
    return response;
  },
};
