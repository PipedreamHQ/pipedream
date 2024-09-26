import openai from "../../openai.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  props: {
    openai,
    modelId: {
      propDefinition: [
        openai,
        "chatCompletionModelId",
      ],
      description: "The ID of the model to use for chat completions",
    },
    ...common.props,
  },
  methods: {
    ...common.methods,
    systemInstructions() {
      throw new Error("systemInstructions() must be implemented by the component");
    },
    userMessage() {
      throw new Error("userMessage() must be implemented by the component");
    },
    summary() {
      return;
    },
    formatOutput() {
      throw new Error("formatOutput() must be implemented by the component");
    },
  },
  async run({ $ }) {
    const messages = [
      {
        role: "system",
        content: this.systemInstructions(),
      },
      {
        role: "user",
        content: this.userMessage(),
      },
    ];
    const data = {
      ...this._getCommonArgs(),
      model: this.modelId,
      messages,
    };
    const response = await this.openai.createChatCompletion({
      $,
      data,
    });

    if (this.summary() && response) {
      $.export("$summary", this.summary());
    }

    return this.formatOutput({
      response,
      messages,
    });
  },
};
