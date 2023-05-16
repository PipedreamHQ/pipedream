import app from "../../metatext_ai_inference_api.app.mjs";

export default {
  key: "metatext_ai_inference_api-request-by-model-type",
  name: "Request By Model Type",
  description: "Make a request to the Inference API using the given model type. [See The Documentation](https://metatext.io/documentation/apis/#apis)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    modelType: {
      propDefinition: [
        app,
        "modelType",
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
  },
  methods: {
    request({
      modelType, ...args
    } = {}) {
      return this.app.post({
        path: `/${modelType}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      modelType,
      text,
    } = this;

    const response = await this.request({
      step,
      modelType,
      data: {
        text,
      },
    });

    step.export("$summary", "Successfully made a request by model type.");

    return response;
  },
};
