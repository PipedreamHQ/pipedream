import rosette_text_analytics from "../../rosette_text_analytics.app.mjs";

export default {
  key: "rosette_text_analytics-list-target-language-options",
  name: "List Target Language Options",
  description: "Retrieves available options for the Target Language field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rosette_text_analytics,
  },
  async run({ $ }) {
    const options = await rosette_text_analytics.propDefinitions.targetLanguage.options
      .call(this.rosette_text_analytics);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
