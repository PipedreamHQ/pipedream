import openai from "../../openai.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  props: {
    openai,
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
    const args = {
      ...this._getCommonArgs(),
      model: "gpt-3.5-turbo",
      messages,
    };
    const response = await this.openai.createChatCompletion({
      $,
      args,
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
