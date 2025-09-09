import cometapi from "../../cometapi.app.mjs";

export default {
  key: "cometapi-retrieve-available-models",
  name: "Retrieve Available Models",
  version: "0.0.1",
  description: "Returns a list of all models available through the CometAPI including GPT, Claude, Gemini, Grok, DeepSeek, and Qwen series. Use this to discover available models before making completion requests. [See the documentation](https://api.cometapi.com/doc)",
  type: "action",
  props: {
    cometapi,
  },
  async run({ $ }) {
    const response = await this.cometapi.listModels({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} available model(s)!`);
    return response;
  },
};
