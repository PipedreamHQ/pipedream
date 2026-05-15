import sparkpost from "../../sparkpost.app.mjs";

export default {
  key: "sparkpost-list-template-id-options",
  name: "List Template ID Options",
  description: "Retrieves available options for the Template ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sparkpost,
  },
  async run({ $ }) {
    const options = await sparkpost.propDefinitions.templateId.options.call(this.sparkpost);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
