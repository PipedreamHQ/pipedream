import translate_com from "../../translate_com.app.mjs";

export default {
  key: "translate_com-list-language-options",
  name: "List Language Options",
  description: "Retrieves available options for the Language field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    translate_com,
  },
  async run({ $ }) {
    const options = await translate_com.propDefinitions.language.options.call(this.translate_com);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
