import app from "../../ollama.app.mjs";

export default {
  key: "ollama-show-model-information",
  name: "Show Model Information",
  description: "Show information about a model including details, modelfile, template, parameters, license, and system prompt. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#show-model-information).",
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
      propDefinition: [
        app,
        "model",
      ],
    },
    verbose: {
      type: "boolean",
      label: "Verbose",
      description: "Show verbose output.",
      optional: true,
    },
  },
  methods: {
    getModelInfo(args = {}) {
      return this.app.post({
        path: "/show",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getModelInfo,
      name,
      verbose,
    } = this;

    const response = await getModelInfo({
      $,
      data: {
        name,
        verbose,
      },
    });

    $.export("$summary", "Successfully retrieved model information.");

    return response;
  },
};
