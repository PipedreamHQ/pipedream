import { v4 as uuid } from "uuid";
import app from "../../runware.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "runware-image-control-net-preprocess",
  name: "Image Control Net Preprocess",
  description: "Request an image control net preprocess task to be processed by the Runware API. [See the documentation](https://docs.runware.ai/en/image-editing/controlnet-tools).",
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
    preProcessorType: {
      type: "string",
      label: "Preprocessor Type",
      description: "The preprocessor to be used.",
      optional: true,
      options: [
        "canny",
        "depth",
        "mlsd",
        "normalbae",
        "openpose",
        "tile",
        "seg",
        "lineart",
        "lineart_anime",
        "shuffle",
        "scribble",
        "softedge",
      ],
    },
    height: {
      propDefinition: [
        app,
        "height",
      ],
    },
    width: {
      propDefinition: [
        app,
        "width",
      ],
    },
    lowThresholdCanny: {
      type: "integer",
      label: "Low Threshold Canny",
      description: "Defines the lower threshold when using the Canny edge detection preprocessor. The recommended value is `100`.",
      optional: true,
    },
    highThresholdCanny: {
      type: "integer",
      label: "High Threshold Canny",
      description: "Defines the high threshold when using the Canny edge detection preprocessor. The recommended value is `200`.",
      optional: true,
    },
    includeHandsAndFaceOpenPose: {
      type: "boolean",
      label: "Include Hands and Face OpenPose",
      description: "Include the hands and face in the pose outline when using the OpenPose preprocessor.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      outputType,
      outputFormat,
      includeCost,
      inputImage,
      preProcessorType,
      height,
      width,
      lowThresholdCanny,
      highThresholdCanny,
      includeHandsAndFaceOpenPose,
    } = this;

    const response = await app.post({
      $,
      data: [
        {
          taskType: constants.TASK_TYPE.IMAGE_CONTROL_NET_PREPROCESS.value,
          taskUUID: uuid(),
          outputType,
          outputFormat,
          inputImage,
          includeCost,
          height,
          width,
          preProcessorType,
          lowThresholdCanny,
          highThresholdCanny,
          includeHandsAndFaceOpenPose,
        },
      ],
    });

    $.export("$summary", `Successfully requested image control net preprocess task with UUID \`${response.data[0].taskUUID}\`.`);
    return response;
  },
};
