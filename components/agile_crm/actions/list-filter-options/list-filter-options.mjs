import agile_crm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-list-filter-options",
  name: "List Filter Options",
  description: "Retrieves available options for the Filter field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    agile_crm,
  },
  async run({ $ }) {
    const options = await agile_crm.propDefinitions.filter.options.call(this.agile_crm);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
