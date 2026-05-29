import passslot from "../../passslot.app.mjs";

export default {
  key: "passslot-list-template-id-options",
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
    passslot,
  },
  async run({ $ }) {
    const options = await passslot.propDefinitions.templateId.options.call(this.passslot);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
