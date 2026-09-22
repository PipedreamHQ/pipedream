import agendor from "../../agendor.app.mjs";

export default {
  key: "agendor-list-sector-options",
  name: "List Sector Options",
  description: "Retrieves available options for the Sector field.",
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
    const options = await agendor.propDefinitions.sector.options.call(this.agendor);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
