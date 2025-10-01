import app from "../../lamini.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "lamini-get-batch-completions",
  name: "Get Batch Completions",
  description: "Retrieve the results of a batch completion request from Lamini. [See the documentation](https://docs.lamini.ai/api/).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    modelName: {
      propDefinition: [
        app,
        "modelName",
      ],
    },
    prompt: {
      type: "string[]",
      label: "Prompts",
      description: "The prompts to use for completion.",
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
    submitBatchCompletions(args = {}) {
      return this.app.post({
        path: "/batch_completions",
        ...args,
      });
    },
    getBatchCompletions({
      id, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/batch_completions/${id}/result`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      submitBatchCompletions,
      getBatchCompletions,
      modelName,
      prompt,
      outputType,
      maxTokens,
      maxNewTokens,
    } = this;

    const { id } = await submitBatchCompletions({
      $,
      data: {
        model_name: modelName,
        prompt,
        output_type: utils.parseJson(outputType),
        max_tokens: maxTokens,
        max_new_tokens: maxNewTokens,
      },
    });

    const response = await getBatchCompletions({
      $,
      id,
    });

    $.export("$summary", `Successfully submitted batch completion with ID \`${id}\`.`);
    return response;
  },
};
