import envoy from "../../envoy.app.mjs";

export default {
  key: "envoy-list-employee-id-options",
  name: "List Host Options",
  description: "Retrieves available options for the Host field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    envoy,
  },
  async run({ $ }) {
    const options = await envoy.propDefinitions.employeeId.options.call(this.envoy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
