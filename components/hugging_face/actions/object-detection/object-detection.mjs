import app from "../../hugging_face.app.mjs";
import tag from "../common/tag.mjs";

export default {
  key: "hugging_face-object-detection",
  name: "Object Detection",
  description: "This task reads some image input and outputs the likelihood of classes and bounding boxes of detected objects. [See the docs](https://huggingface.co/docs/huggingface.js/inference/classes/HfInference#objectdetection).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    modelId: {
      propDefinition: [
        app,
        "modelId",
        () => ({
          tagFilter: tag.OBJECT_DETECTION,
        }),
      ],
    },
    imageUrl: {
      description: "The image url to use for object detection.",
      propDefinition: [
        app,
        "imageUrl",
      ],
    },
  },
  async run({ $: step }) {
    const {
      modelId,
      imageUrl,
    } = this;

    const image = await this.app.getBinaryFromUrl(imageUrl);

    const response = await this.app.inference({
      step,
      modelId,
      data: {
        inputs: {
          image,
        },
      },
    });

    step.export("$summary", "Successfully detected objects");

    return response;
  },
};
