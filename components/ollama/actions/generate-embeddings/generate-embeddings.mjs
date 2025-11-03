import utils from "../../common/utils.mjs";
import app from "../../ollama.app.mjs";

export default {
  key: "ollama-generate-embeddings",
  name: "Generate Embeddings",
  description: "Generate embeddings from a model. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-embeddings).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    input: {
      type: "string[]",
      label: "Input",
      description: "The list of texts to generate embeddings for.",
    },
    truncate: {
      type: "boolean",
      label: "Truncate",
      description: "Truncates the end of each input to fit within context length. Returns error if `false` and context length is exceeded. Defaults to `true`.",
      optional: true,
    },
    options: {
      propDefinition: [
        app,
        "options",
      ],
    },
    keepAlive: {
      propDefinition: [
        app,
        "keepAlive",
      ],
    },
  },
  methods: {
    generateEmbeddings(args = {}) {
      return this.app.post({
        path: "/embed",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateEmbeddings,
      model,
      input,
      truncate,
      options,
      keepAlive,
    } = this;

    const response = await generateEmbeddings({
      $,
      data: {
        model,
        input,
        truncate,
        options: utils.parseOptions(options),
        keep_alive: keepAlive,
      },
    });
    $.export("$summary", "Successfully generated embeddings.");
    return response;
  },
};
