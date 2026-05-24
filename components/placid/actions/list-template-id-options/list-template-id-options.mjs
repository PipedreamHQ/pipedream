import placid from "../../placid.app.mjs";

export default {
  key: "placid-list-template-id-options",
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
    placid,
  },
  async run({ $ }) {
    const options = await placid.propDefinitions.templateId.options.call(this.placid);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
