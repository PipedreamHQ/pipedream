import microsoft_azure_ai_translator from "../../microsoft_azure_ai_translator.app.mjs";

export default {
  key: "microsoft_azure_ai_translator-list-to-options",
  name: "List Output Language Options",
  description: "Retrieves available options for the Output Language field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoft_azure_ai_translator,
  },
  async run({ $ }) {
    const options = await microsoft_azure_ai_translator.propDefinitions.to.options
      .call(this.microsoft_azure_ai_translator);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
