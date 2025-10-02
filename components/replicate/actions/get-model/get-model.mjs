import replicate from "../../replicate.app.mjs";

export default {
  key: "replicate-get-model",
  name: "Get Model",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get a specific model identified by Id. [See the documentation](https://replicate.com/docs/reference/http#models.get)",
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
  },
  async run({ $ }) {
    const {
      replicate,
      modelId,
    } = this;

    const response = await replicate.getModel({
      $,
      modelId,
    });

    const [
      ownerId,
      modelName,
    ] = modelId.split("/");

    $.export("$summary", `The model ${modelName} of ${ownerId} was successfully fetched!`);
    return response;
  },
};
