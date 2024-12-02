import app from "../../x_ai.app.mjs";

export default {
  key: "x_ai-post-completion",
  name: "Post Completion",
  description: "Create a language model response for a given prompt. [See the documentation](https://docs.x.ai/api/endpoints#completions)",
  version: "0.0.1",
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
  },

  async run({ $ }) {
    const response = await this.app.postCompletion({
      $,
      data: {
        model: this.model,
        prompt: this.prompt,
      },
    });

    $.export("$summary", `Successfully sent prompt to the model '${this.model}'`);

    return response;
  },
};
