import app from "../../ollama.app.mjs";

export default {
  key: "ollama-create-model",
  name: "Create Model",
  description: "Create a model from a modelfile. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#create-a-model).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the model.",
    },
    modelfile: {
      type: "string",
      label: "Model File",
      description: "Contents of the Modelfile. Eg. `FROM llama3 SYSTEM You are mario from Super Mario Bros`",
    },
    stream: {
      propDefinition: [
        app,
        "stream",
      ],
    },
  },
  methods: {
    createModel(args = {}) {
      return this.app.post({
        path: "/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createModel,
      name,
      modelfile,
      stream,
    } = this;

    const response = await createModel({
      $,
      data: {
        name,
        modelfile,
        stream,
      },
    });
    $.export("$summary", "Successfully created model.");
    return response;
  },
};
