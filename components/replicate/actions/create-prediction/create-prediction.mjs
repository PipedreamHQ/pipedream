import replicate from "../../replicate.app.mjs";

export default {
  key: "replicate-create-prediction",
  name: "Create Prediction",
  version: "0.0.1",
  description: "Create a new prediction [See the documentation](https://replicate.com/docs/reference/http#predictions.create)",
  type: "action",
  props: {
    replicate,
    collectionSlug: {
      propDefinition: [
        replicate,
        "collectionSlug",
      ],
    },
    modelId: {
      propDefinition: [
        replicate,
        "modelId",
        ({ collectionSlug }) => ({
          collectionSlug,
        }),
      ],
    },
    version: {
      propDefinition: [
        replicate,
        "modelVersion",
        ({ modelId }) => ({
          modelId,
        }),
      ],
    },
    input: {
      type: "string",
      label: "Input",
      description: "The model's input as a JSON object. The input depends on what model you are running. To see the available inputs, click the \"Run with API\" tab on the model you are running. For example, stability-ai/stable-diffusion takes prompt as an input.",
    },
  },
  async run({ $ }) {
    const {
      replicate,
      version,
      input,
    } = this;

    const response = await replicate.createPrediction({
      $,
      data: {
        version,
        input: JSON.parse(input),
      },
    });

    $.export("$summary", `A new prediction with Id: ${response.id} was successfully created!`);
    return response;
  },
};
