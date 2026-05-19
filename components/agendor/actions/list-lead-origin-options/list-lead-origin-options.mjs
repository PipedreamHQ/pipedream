import agendor from "../../agendor.app.mjs";

export default {
  key: "agendor-list-lead-origin-options",
  name: "List Lead Origin Options",
  description: "Retrieves available options for the Lead Origin field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    agendor,
  },
  async run({ $ }) {
    const options = await agendor.propDefinitions.leadOrigin.options.call(this.agendor);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
