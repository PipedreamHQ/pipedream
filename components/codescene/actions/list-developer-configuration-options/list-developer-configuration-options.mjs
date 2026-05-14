import codescene from "../../codescene.app.mjs";

export default {
  key: "codescene-list-developer-configuration-options",
  name: "List Developer Configuration Options",
  description: "Retrieves available options for the Developer Configuration field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    codescene,
  },
  async run({ $ }) {
    const options = await codescene.propDefinitions.developerConfiguration.options
      .call(this.codescene);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
