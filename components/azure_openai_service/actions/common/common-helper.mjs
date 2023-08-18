import common from "./common.mjs";

export default {
  ...common,
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
      messages,
    };
    const response = await this.azureOpenAI.createChatCompletion({
      $,
      data,
    });

    if (this.summary(response)) {
      $.export("$summary", this.summary(response));
    }

    return this.formatOutput({
      response,
      messages,
    });
  },
};
