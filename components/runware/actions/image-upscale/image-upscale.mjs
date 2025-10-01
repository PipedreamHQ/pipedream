import { v4 as uuid } from "uuid";
import app from "../../runware.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "runware-image-upscale",
  name: "Image Upscale",
  description: "Request an image upscale task to be processed by the Runware API. [See the documentation](https://docs.runware.ai/en/image-editing/upscaling).",
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
    upscaleFactor: {
      type: "integer",
      label: "Upscale Factor",
      description: "The level of upscaling performed. Each will increase the size of the image by the corresponding factor. Eg. `2`.",
      min: 2,
      max: 4,
    },
    includeCost: {
      propDefinition: [
        app,
        "includeCost",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      inputImage,
      outputType,
      outputFormat,
      upscaleFactor,
      includeCost,
    } = this;

    const response = await app.post({
      $,
      data: [
        {
          taskType: constants.TASK_TYPE.IMAGE_UPSCALE.value,
          taskUUID: uuid(),
          inputImage,
          outputType,
          outputFormat,
          upscaleFactor,
          includeCost,
        },
      ],
    });

    $.export("$summary", `Successfully requested image upscale task with UUID \`${response.data[0].taskUUID}\`.`);
    return response;
  },
};
