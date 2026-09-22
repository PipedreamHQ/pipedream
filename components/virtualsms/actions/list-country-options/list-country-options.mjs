import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-list-country-options",
  name: "List Country Options",
  description: "Retrieves available options for the Country field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    virtualsms,
  },
  async run({ $ }) {
    const options = await virtualsms.propDefinitions.country.options.call(this.virtualsms);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
