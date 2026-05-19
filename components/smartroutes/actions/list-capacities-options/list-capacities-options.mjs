import smartroutes from "../../smartroutes.app.mjs";

export default {
  key: "smartroutes-list-capacities-options",
  name: "List Capacities Options",
  description: "Retrieves available options for the Capacities field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartroutes,
  },
  async run({ $ }) {
    const options = await smartroutes.propDefinitions.capacities.options
      .call(this.smartroutes);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
