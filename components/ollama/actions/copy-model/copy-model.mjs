import app from "../../ollama.app.mjs";

export default {
  key: "ollama-copy-model",
  name: "Copy Model",
  description: "Copies a model, creating a model with another name from an existing model. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#copy-a-model).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    source: {
      propDefinition: [
        app,
        "model",
      ],
    },
    destination: {
      type: "string",
      label: "New Model Name",
      description: "The new name for the copied model.",
    },
  },
  methods: {
    copyModel(args = {}) {
      return this.app.post({
        path: "/copy",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      copyModel,
      source,
      destination,
    } = this;

    await copyModel({
      $,
      data: {
        source,
        destination,
      },
    });
    $.export("$summary", "Successfully copied model.");
    return {
      success: true,
    };
  },
};
