import { v4 as uuid } from "uuid";
import app from "../../runware.app.mjs";

export default {
  key: "runware-request-task",
  name: "Request Task",
  description: "Request one task to be processed by the Runware API. [See the documentation](https://docs.runware.ai/en/image-inference/api-reference).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    taskType: {
      propDefinition: [
        app,
        "taskType",
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
    uploadEndpoint: {
      propDefinition: [
        app,
        "uploadEndpoint",
      ],
    },
    checkNSFW: {
      propDefinition: [
        app,
        "checkNSFW",
      ],
    },
    includeCost: {
      propDefinition: [
        app,
        "includeCost",
      ],
    },
    positivePrompt: {
      propDefinition: [
        app,
        "positivePrompt",
      ],
    },
    negativePrompt: {
      propDefinition: [
        app,
        "negativePrompt",
      ],
    },
    seedImage: {
      propDefinition: [
        app,
        "seedImage",
      ],
    },
    maskImage: {
      propDefinition: [
        app,
        "maskImage",
      ],
    },
    strength: {
      propDefinition: [
        app,
        "strength",
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
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    steps: {
      propDefinition: [
        app,
        "steps",
      ],
    },
    scheduler: {
      propDefinition: [
        app,
        "scheduler",
      ],
    },
    seed: {
      propDefinition: [
        app,
        "seed",
      ],
    },
    numberResults: {
      propDefinition: [
        app,
        "numberResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      taskType,
      outputType,
      outputFormat,
      uploadEndpoint,
      checkNSFW,
      includeCost,
      positivePrompt,
      negativePrompt,
      seedImage,
      maskImage,
      strength,
      height,
      width,
      model,
      steps,
      scheduler,
      seed,
      numberResults,
    } = this;

    const response = await app.post({
      $,
      data: [
        {
          taskUUID: uuid(),
          taskType,
          outputType,
          outputFormat,
          uploadEndpoint,
          checkNSFW,
          includeCost,
          positivePrompt,
          negativePrompt,
          seedImage,
          maskImage,
          strength,
          height,
          width,
          model,
          steps,
          scheduler,
          seed: seed
            ? parseInt(seed)
            : undefined,
          numberResults,
        },
      ],
    });

    $.export("$summary", `Successfully requested task with UUID \`${response.data[0].taskUUID}\`.`);
    return response;
  },
};
