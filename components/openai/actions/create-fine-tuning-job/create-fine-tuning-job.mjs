import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-fine-tuning-job",
  name: "Create Fine Tuning Job",
  description: "Creates a job that fine-tunes a specified model from a given dataset. [See the documentation](https://beta.openai.com/docs/guides/fine-tuning)",
  version: "0.0.1",
  type: "action",
  props: {
    openai,
    model: {
      propDefinition: [
        openai,
        "model",
        () => ({
          model: "gpt-3.5-turbo-1006",
        }), // Default to recommended model if none provided
      ],
    },
    trainingFile: {
      propDefinition: [
        openai,
        "trainingFile",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai._makeRequest({
      $,
      method: "POST",
      path: "/fine_tuning/jobs",
      data: {
        model: this.model,
        training_file: this.trainingFile,
      },
    });

    $.export("$summary", `Successfully created fine-tuning job with model ${this.model}`);
    return response;
  },
};
