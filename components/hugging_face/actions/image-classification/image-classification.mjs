import app from "../../hugging_face.app.mjs";
import tag from "../common/tag.mjs";

export default {
  key: "hugging_face-image-classification",
  name: "Image Classification",
  description: "This task reads some image input and outputs the likelihood of classes. This action allows you to classify images into categories. [See the docs](https://huggingface.co/docs/huggingface.js/inference/classes/HfInference#imageclassification).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    modelId: {
      propDefinition: [
        app,
        "modelId",
        () => ({
          tagFilter: tag.IMAGE_CLASSIFICATION,
        }),
      ],
    },
    imageUrl: {
      description: "The image url to use for classification.",
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

    step.export("$summary", "Successfully classified image");

    return response;
  },
};
