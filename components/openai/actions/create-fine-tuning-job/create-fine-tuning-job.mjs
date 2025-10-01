import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-fine-tuning-job",
  name: "Create Fine Tuning Job",
  description: "Creates a job that fine-tunes a specified model from a given dataset. [See the documentation](https://platform.openai.com/docs/api-reference/fine-tuning/create)",
  version: "0.0.16",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openai,
    model: {
      propDefinition: [
        openai,
        "fineTuningModel",
      ],
    },
    trainingFile: {
      propDefinition: [
        openai,
        "fileId",
        () => ({
          purpose: "fine-tune",
        }),
      ],
      label: "Training File",
      description: "The ID of an uploaded file that contains training data. You can use the **Upload File** action and reference the returned ID here.",
    },
    hyperParameters: {
      type: "object",
      label: "Hyperparameters",
      description: "The hyperparameters used for the fine-tuning job. [See details in the documentation](https://platform.openai.com/docs/api-reference/fine-tuning/create#fine-tuning-create-hyperparameters).",
      optional: true,
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "A string of up to 18 characters that will be added to your fine-tuned model name.",
      optional: true,
    },
    validationFile: {
      propDefinition: [
        openai,
        "fileId",
        () => ({
          purpose: "fine-tune",
        }),
      ],
      label: "Validation File",
      description: "The ID of an uploaded file that contains validation data. [See details in the documentation](https://platform.openai.com/docs/api-reference/fine-tuning/create#fine-tuning-create-validation_file).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.createFineTuningJob({
      $,
      data: {
        model: this.model,
        training_file: this.trainingFile,
        hyperparameters: this.hyperParameters,
        suffix: this.suffix,
        validation_file: this.validationFile,
      },
    });

    $.export("$summary", `Successfully created fine-tuning job with model ${this.model}`);
    return response;
  },
};
