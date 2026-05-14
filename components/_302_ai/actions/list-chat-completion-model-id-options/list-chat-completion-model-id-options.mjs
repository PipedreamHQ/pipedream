import _302_ai from "../../_302_ai.app.mjs";

export default {
  key: "_302_ai-list-chat-completion-model-id-options",
  name: "List Model Options",
  description: "Retrieves available options for the Model field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    _302_ai,
  },
  async run({ $ }) {
    const options = await _302_ai.propDefinitions.chatCompletionModelId.options.call(this._302_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
