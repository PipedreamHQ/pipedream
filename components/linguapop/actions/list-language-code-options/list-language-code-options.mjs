import linguapop from "../../linguapop.app.mjs";

export default {
  key: "linguapop-list-language-code-options",
  name: "List Language Code Options",
  description: "Retrieves available options for the Language Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linguapop,
  },
  async run({ $ }) {
    const options = await linguapop.propDefinitions.languageCode.options.call(this.linguapop);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
