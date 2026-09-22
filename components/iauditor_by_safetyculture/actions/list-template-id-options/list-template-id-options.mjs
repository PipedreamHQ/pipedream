import iauditor_by_safetyculture from "../../iauditor_by_safetyculture.app.mjs";

export default {
  key: "iauditor_by_safetyculture-list-template-id-options",
  name: "List Template Options",
  description: "Retrieves available options for the Template field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    iauditor_by_safetyculture,
  },
  async run({ $ }) {
    const options = await iauditor_by_safetyculture.propDefinitions.templateId.options
      .call(this.iauditor_by_safetyculture);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
