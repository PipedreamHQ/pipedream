import groqcloud from "../../groqcloud.app.mjs";

export default {
  key: "groqcloud-list-model-options",
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
    groqcloud,
  },
  async run({ $ }) {
    const options = await groqcloud.propDefinitions.model.options.call(this.groqcloud);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
