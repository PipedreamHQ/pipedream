import { v4 as uuid } from "uuid";
import app from "../../runware.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "runware-image-inference",
  name: "Image Inference",
  description: "Request an image inference task to be processed by the Runware API. [See the documentation](https://docs.runware.ai/en/image-inference/api-reference).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    structure: {
      type: "string",
      label: "Structure",
      description: "The structure of the task to be processed.",
      options: Object.values(constants.IMAGE_INFERENCE_STRUCTURE),
      reloadProps: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "This identifier is a unique string that represents a specific model. You can find the AIR identifier of the model you want to use in our [Model Explorer](https://docs.runware.ai/en/image-inference/models#model-explorer), which is a tool that allows you to search for models based on their characteristics. More information about the AIR system can be found in the [Models page](https://docs.runware.ai/en/image-inference/models). Eg. `civitai:78605@83390`.",
    },
    positivePrompt: {
      type: "string",
      label: "Positive Prompt",
      description: "A positive prompt is a text instruction to guide the model on generating the image. It is usually a sentence or a paragraph that provides positive guidance for the task. This parameter is essential to shape the desired results. For example, if the positive prompt is `dragon drinking coffee`, the model will generate an image of a dragon drinking coffee. The more detailed the prompt, the more accurate the results. The length of the prompt must be between 4 and 2000 characters.",
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
    uploadEndpoint: {
      type: "string",
      label: "Upload Endpoint",
      description: "This parameter allows you to specify a URL to which the generated image will be uploaded as binary image data using the HTTP PUT method. For example, an S3 bucket URL can be used as the upload endpoint. When the image is ready, it will be uploaded to the specified URL.",
      optional: true,
    },
    checkNSFW: {
      type: "boolean",
      label: "Check NSFW",
      description: "This parameter is used to enable or disable the NSFW check. When enabled, the API will check if the image contains NSFW (not safe for work) content. This check is done using a pre-trained model that detects adult content in images. When the check is enabled, the API will return `NSFWContent: true` in the response object if the image is flagged as potentially sensitive content. If the image is not flagged, the API will return `NSFWContent: false`. If this parameter is not used, the parameter `NSFWContent` will not be included in the response object. Adds `0.1` seconds to image inference time and incurs additional costs. The NSFW filter occasionally returns false positives and very rarely false negatives.",
      optional: true,
    },
    includeCost: {
      propDefinition: [
        app,
        "includeCost",
      ],
    },
    scheduler: {
      type: "string",
      label: "Scheduler",
      description: "An scheduler is a component that manages the inference process. Different schedulers can be used to achieve different results like more detailed images, faster inference, or more accurate results. The default scheduler is the one that the model was trained with, but you can choose a different one to get different results. Schedulers are explained in more detail in the [Schedulers page](https://docs.runware.ai/en/image-inference/schedulers).",
      optional: true,
    },
    seed: {
      type: "string",
      label: "Seed",
      description: "A seed is a value used to randomize the image generation. If you want to make images reproducible (generate the same image multiple times), you can use the same seed value. When requesting multiple images with the same seed, the seed will be incremented by 1 (+1) for each image generated. Min: `0` Max: `9223372036854776000`. Defaults to `Random`.",
      optional: true,
    },
    numberResults: {
      type: "integer",
      label: "Number Of Results",
      description: "The number of images to generate from the specified prompt. If **Seed** is set, it will be incremented by 1 (+1) for each image generated.",
      optional: true,
    },
  },
  additionalProps() {
    const { structure } = this;

    const seedImage = {
      type: "string",
      label: "Seed Image",
      description: "When doing Image-to-Image, Inpainting or Outpainting, this parameter is **required**. Specifies the seed image to be used for the diffusion process. The image can be specified in one of the following formats:\n - An UUID v4 string of a [previously uploaded image](https://docs.runware.ai/en/getting-started/image-upload) or a [generated image](https://docs.runware.ai/en/image-inference/api-reference).\n - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.\n - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.\n - A URL pointing to the image. The image must be accessible publicly. Supported formats are: PNG, JPG and WEBP.",
    };

    const maskImage = {
      type: "string",
      label: "Mask Image",
      description: "When doing Inpainting or Outpainting, this parameter is **required**. Specifies the mask image to be used for the inpainting process. The image can be specified in one of the following formats:\n - An UUID v4 string of a [previously uploaded image](https://docs.runware.ai/en/getting-started/image-upload) or a [generated image](https://docs.runware.ai/en/image-inference/api-reference).\n - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.\n - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.\n - A URL pointing to the image. The image must be accessible publicly. Supported formats are: PNG, JPG and WEBP.",
    };

    const strength = {
      type: "string",
      label: "Strength",
      description: "When doing Image-to-Image, Inpainting or Outpainting, this parameter is used to determine the influence of the **Seed Image** image in the generated output. A higher value results in more influence from the original image, while a lower value allows more creative deviation. Min: `0` Max: `1` and Default: `0.8`.",
      optional: true,
    };

    const controlNetModel = {
      type: "string",
      label: "ControlNet Model 0",
      description: "For basic/common ControlNet models, you can check the list of available models [here](https://docs.runware.ai/en/image-inference/models#basic-controlnet-models). For custom or specific ControlNet models, we make use of the [AIR system](https://github.com/civitai/civitai/wiki/AIR-%E2%80%90-Uniform-Resource-Names-for-AI) to identify ControlNet models. This identifier is a unique string that represents a specific model. You can find the AIR identifier of the ControlNet model you want to use in our [Model Explorer](https://docs.runware.ai/en/image-inference/models#model-explorer), which is a tool that allows you to search for models based on their characteristics. More information about the AIR system can be found in the [Models page](https://docs.runware.ai/en/image-inference/models).",
    };

    const controlNetGuideImage = {
      type: "string",
      label: "ControlNet Guide Image 0",
      description: "The guide image for ControlNet.",
    };

    const controlNetWeight = {
      type: "integer",
      label: "ControlNet Weight 0",
      description: "The weight for ControlNet.",
    };

    const controlNetStartStep = {
      type: "integer",
      label: "ControlNet Start Step 0",
      description: "The start step for ControlNet.",
    };

    const controlNetEndStep = {
      type: "integer",
      label: "ControlNet End Step 0",
      description: "The end step for ControlNet.",
    };

    const controlNetControlMode = {
      type: "string",
      label: "ControlNet Control Mode 0",
      description: "The control mode for ControlNet.",
    };

    const loraModel = {
      type: "string",
      label: "LoRA Model 0",
      description: "We make use of the [AIR system](https://github.com/civitai/civitai/wiki/AIR-%E2%80%90-Uniform-Resource-Names-for-AI) to identify LoRA models. This identifier is a unique string that represents a specific model. You can find the AIR identifier of the LoRA model you want to use in our [Model Explorer](https://docs.runware.ai/en/image-inference/models#model-explorer), which is a tool that allows you to search for models based on their characteristics. More information about the AIR system can be found in the [Models page](https://docs.runware.ai/en/image-inference/models).",
    };

    const loraWeight = {
      type: "integer",
      label: "LoRA Weight 0",
      description: "It is possible to use multiple LoRAs at the same time. With the `weight` parameter you can assign the importance of the LoRA with respect to the others. The sum of all `weight` parameters must always be `1`. If needed, we will increase the values proportionally to achieve it.",
      optional: true,
    };

    if (structure === constants.IMAGE_INFERENCE_STRUCTURE.TEXT_TO_IMAGE.value) {
      return {
        outputType: {
          type: "string",
          label: "Output Type",
          description: "Specifies the output type in which the image is returned.",
          optional: true,
          options: [
            "base64Data",
            "dataURI",
            "URL",
          ],
        },
        outputFormat: {
          type: "string",
          label: "Output Format",
          description: "Specifies the format of the output image.",
          optional: true,
          options: [
            "PNG",
            "JPG",
            "WEBP",
          ],
        },
        negativePrompt: {
          type: "string",
          label: "Negative Prompt",
          description: "A negative prompt is a text instruction to guide the model on generating the image. It is usually a sentence or a paragraph that provides negative guidance for the task. This parameter helps to avoid certain undesired results. For example, if the negative prompt is `red dragon, cup`, the model will follow the positive prompt but will avoid generating an image of a red dragon or including a cup. The more detailed the prompt, the more accurate the results. The length of the prompt must be between 4 and 2000 characters.",
          optional: true,
        },
        steps: {
          type: "integer",
          label: "Steps",
          description: "The number of steps is the number of iterations the model will perform to generate the image. The higher the number of steps, the more detailed the image will be. However, increasing the number of steps will also increase the time it takes to generate the image and may not always result in a better image (some [schedulers](https://docs.runware.ai/en/image-inference/api-reference#request-scheduler) work differently). When using your own models you can specify a new default value for the number of steps. Defaults to `20`.",
          min: 1,
          max: 100,
          optional: true,
        },
        CFGScale: {
          type: "string",
          label: "CFG Scale",
          description: "Guidance scale represents how closely the images will resemble the prompt or how much freedom the AI model has. Higher values are closer to the prompt. Low values may reduce the quality of the results. Min: `0`, Max: `30` Default: `7`.",
          optional: true,
        },
      };
    }

    if (structure === constants.IMAGE_INFERENCE_STRUCTURE.IMAGE_TO_IMAGE.value) {
      return {
        seedImage,
        strength,
      };
    }

    if (structure === constants.IMAGE_INFERENCE_STRUCTURE.IN_OUT_PAINTING.value) {
      return {
        seedImage,
        maskImage,
        strength,
      };
    }

    if (structure === constants.IMAGE_INFERENCE_STRUCTURE.REFINER.value) {
      return {
        refinerModel: {
          type: "string",
          label: "Refiner Model",
          description: "We make use of the [AIR system](https://github.com/civitai/civitai/wiki/AIR-%E2%80%90-Uniform-Resource-Names-for-AI) to identify refinement models. This identifier is a unique string that represents a specific model. Note that refiner models are only SDXL based. You can find the AIR identifier of the refinement model you want to use in our [Model Explorer](https://docs.runware.ai/en/image-inference/models#model-explorer), which is a tool that allows you to search for models based on their characteristics. More information about the AIR system can be found in the [Models page](https://docs.runware.ai/en/image-inference/models).",
        },
        refinerStartStep: {
          type: "integer",
          label: "Refiner Start Step",
          description: "Represents the step number at which the refinement process begins. The initial model will generate the image up to this step, after which the refiner model takes over to enhance the result. It can take values from `0` (first step) to the number of [steps](https://docs.runware.ai/en/image-inference/api-reference#request-steps) specified.",
          optional: true,
        },
      };
    }

    if (structure === constants.IMAGE_INFERENCE_STRUCTURE.CONTROL_NET.value) {
      return {
        controlNetModel1: {
          ...controlNetModel,
          label: "Control Net Model 1",
        },
        controlNetGuideImage1: {
          ...controlNetGuideImage,
          label: "Control Net Guide Image 1",
        },
        controlNetWeight1: {
          ...controlNetWeight,
          label: "Control Net Weight 1",
        },
        controlNetStartStep1: {
          ...controlNetStartStep,
          label: "Control Net Start Step 1",
        },
        controlNetEndStep1: {
          label: "Control Net End Step 1",
          ...controlNetEndStep,
        },
        controlNetControlMode1: {
          ...controlNetControlMode,
          label: "Control Net Control Mode 1",
        },
        controlNetModel2: {
          ...controlNetModel,
          label: "Control Net Model 2",
          optional: true,
        },
        controlNetGuideImage2: {
          ...controlNetGuideImage,
          label: "Control Net Guide Image 2",
          optional: true,
        },
        controlNetWeight2: {
          ...controlNetWeight,
          label: "Control Net Weight 2",
          optional: true,
        },
        controlNetStartStep2: {
          ...controlNetStartStep,
          label: "Control Net Start Step 2",
          optional: true,
        },
        controlNetEndStep2: {
          ...controlNetEndStep,
          label: "Control Net End Step 2",
          optional: true,
        },
        controlNetControlMode2: {
          ...controlNetControlMode,
          label: "Control Net Control Mode 2",
          optional: true,
        },
      };
    }

    if (structure === constants.IMAGE_INFERENCE_STRUCTURE.LORA.value) {
      return {
        loraModel1: {
          ...loraModel,
          label: "LoRA Model 1",
        },
        loraWeight1: {
          label: "LoRA Weight 1",
          ...loraWeight,
        },
        loraModel2: {
          label: "LoRA Model 2",
          ...loraModel,
          optional: true,
        },
        loraWeight2: {
          label: "LoRA Weight 2",
          ...loraWeight,
        },
      };
    }

    return {};
  },
  async run({ $ }) {
    const {
      app,
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
      CFGScale,
      refinerModel,
      refinerStartStep,
      controlNetModel1,
      controlNetGuideImage1,
      controlNetWeight1,
      controlNetStartStep1,
      controlNetEndStep1,
      controlNetControlMode1,
      controlNetModel2,
      controlNetGuideImage2,
      controlNetWeight2,
      controlNetStartStep2,
      controlNetEndStep2,
      controlNetControlMode2,
      loraModel1,
      loraWeight1,
      loraModel2,
      loraWeight2,
    } = this;

    const data = {
      taskType: constants.TASK_TYPE.IMAGE_INFERENCE.value,
      taskUUID: uuid(),
      positivePrompt,
      outputType,
      outputFormat,
      uploadEndpoint,
      checkNSFW,
      includeCost,
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
      CFGScale,
      refiner: refinerModel
        ? {
          model: refinerModel,
          startStep: refinerStartStep,
        }
        : undefined,
      controlNet: controlNetModel1
        ? [
          {
            model: controlNetModel1,
            guideImage: controlNetGuideImage1,
            weight: controlNetWeight1,
            startStep: controlNetStartStep1,
            endStep: controlNetEndStep1,
            controlMode: controlNetControlMode1,
          },
          ...(controlNetModel2
            ? [
              {
                model: controlNetModel2,
                guideImage: controlNetGuideImage2,
                weight: controlNetWeight2,
                startStep: controlNetStartStep2,
                endStep: controlNetEndStep2,
                controlMode: controlNetControlMode2,
              },
            ]
            : []
          ),
        ]
        : undefined,
      lora: loraModel1
        ? [
          {
            model: loraModel1,
            weight: loraWeight1,
          },
          ...(loraModel2
            ? [
              {
                model: loraModel2,
                weight: loraWeight2,
              },
            ]
            : []
          ),
        ]
        : undefined,
    };

    const response = await app.post({
      $,
      data: [
        data,
      ],
    });

    $.export("$summary", `Successfully requested image inference task with UUID \`${response.data[0].taskUUID}\`.`);
    return response;
  },
};
