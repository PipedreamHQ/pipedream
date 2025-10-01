import utils from "../../common/utils.mjs";
import app from "../../ollama.app.mjs";

export default {
  key: "ollama-generate-completion",
  name: "Generate Completion",
  description: "Generates a response for a given prompt with a provided model. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion).",
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
    prompt: {
      propDefinition: [
        app,
        "prompt",
      ],
    },
    suffix: {
      propDefinition: [
        app,
        "suffix",
      ],
    },
    images: {
      propDefinition: [
        app,
        "images",
      ],
    },
    options: {
      propDefinition: [
        app,
        "options",
      ],
    },
    stream: {
      propDefinition: [
        app,
        "stream",
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
    generateCompletion(args = {}) {
      return this.app.post({
        path: "/generate",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateCompletion,
      model,
      prompt,
      suffix,
      images,
      options,
      stream,
      keepAlive,
    } = this;

    const response = await generateCompletion({
      $,
      data: {
        model,
        prompt,
        suffix,
        images,
        options: utils.parseOptions(options),
        stream,
        keep_alive: keepAlive,
      },
    });
    $.export("$summary", "Successfully generated completion.");
    return response;
  },
};
