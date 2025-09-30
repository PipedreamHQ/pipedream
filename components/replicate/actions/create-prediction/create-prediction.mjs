import replicate from "../../replicate.app.mjs";

export default {
  key: "replicate-create-prediction",
  name: "Create Prediction",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    webhook: {
      type: "string",
      label: "Webhook",
      description: "An HTTPS URL for receiving a webhook when the prediction has new output.",
      optional: true,
    },
    webhookEventsFilter: {
      type: "string[]",
      label: "Webhook Events Filter",
      description: "By default, we will send requests to your webhook URL whenever there are new logs, new outputs, or the prediction has finished. [See de documentartion here](https://replicate.com/docs/reference/http#predictions.create--webhook_events_filter) for more details.",
      options: [
        "start",
        "output",
        "logs",
        "completed",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      replicate,
      version,
      input,
      webhook,
      webhookEventsFilter,
    } = this;

    const response = await replicate.createPrediction({
      $,
      data: {
        version,
        input: JSON.parse(input),
        webhook,
        webhook_events_filter: webhookEventsFilter,
      },
    });

    $.export("$summary", `A new prediction with Id: ${response.id} was successfully created!`);
    return response;
  },
};
