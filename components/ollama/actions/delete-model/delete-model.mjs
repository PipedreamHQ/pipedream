import app from "../../ollama.app.mjs";

export default {
  key: "ollama-delete-model",
  name: "Delete Model",
  description: "Delete a model and its data. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#delete-a-model)",
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
      propDefinition: [
        app,
        "model",
      ],
    },
  },
  methods: {
    deleteModel(args = {}) {
      return this.app.delete({
        path: "/delete",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteModel,
      name,
    } = this;

    await deleteModel({
      $,
      data: {
        name,
      },
    });
    $.export("$summary", "Successfully deleted model.");
    return {
      success: true,
    };
  },
};
