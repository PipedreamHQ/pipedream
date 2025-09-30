import mistralAI from "../../mistral_ai.app.mjs";

export default {
  key: "mistral_ai-list-models",
  name: "List Models",
  description: "Retrieve a list of available Mistral AI models that the user is authorized to access. [See the Documentation](https://docs.mistral.ai/api/#tag/models)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mistralAI,
  },
  async run({ $ }) {
    const { data } = await this.mistralAI.listModels({
      $,
    });
    if (data?.length) {
      $.export("$summary", `Successfully retrieved ${data.length} model${data.length === 1
        ? ""
        : "s"}`);
    }
    return data;
  },
};
