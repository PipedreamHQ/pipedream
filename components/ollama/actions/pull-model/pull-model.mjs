import app from "../../ollama.app.mjs";

export default {
  key: "ollama-pull-model",
  name: "Pull Model",
  description: "Download a model from the ollama library. Cancelled pulls are resumed from where they left off, and multiple calls will share the same download progress. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#pull-a-model).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Model Name",
      description: "The name of the model to pull.",
    },
    insecure: {
      propDefinition: [
        app,
        "insecure",
      ],
    },
    stream: {
      propDefinition: [
        app,
        "stream",
      ],
    },
  },
  methods: {
    pullModel(args = {}) {
      return this.app.post({
        path: "/pull",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      pullModel,
      name,
      insecure,
      stream,
    } = this;

    const response = await pullModel({
      $,
      data: {
        name,
        insecure,
        stream,
      },
    });
    $.export("$summary", "Successfully pulled model.");
    return response;
  },
};
