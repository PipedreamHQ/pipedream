import app from "../../lamini.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "lamini-generate-completion",
  name: "Generate Completion",
  description: "Generate completions using a Lamini model. [See the documentation](https://docs.lamini.ai/api/).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    modelName: {
      propDefinition: [
        app,
        "modelName",
      ],
      description: "The model to use for completion.",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt to send to the model.",
    },
    outputType: {
      propDefinition: [
        app,
        "outputType",
      ],
    },
    maxTokens: {
      propDefinition: [
        app,
        "maxTokens",
      ],
    },
    maxNewTokens: {
      propDefinition: [
        app,
        "maxNewTokens",
      ],
    },
  },
  methods: {
    generateCompletion(args = {}) {
      return this.app.post({
        path: "/completions",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateCompletion,
      modelName,
      prompt,
      outputType,
      maxTokens,
      maxNewTokens,
    } = this;

    const response = await generateCompletion({
      $,
      data: {
        model_name: modelName,
        prompt,
        output_type: utils.parseJson(outputType),
        max_tokens: maxTokens,
        max_new_tokens: maxNewTokens,
      },
    });

    $.export("$summary", `Successfully generated completion for prompt with model ${modelName}.`);
    return response;
  },
};
