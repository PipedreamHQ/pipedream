import onbee_app from "../../onbee_app.app.mjs";

export default {
  key: "onbee_app-list-employee-id-options",
  name: "List Employee ID Options",
  description: "Retrieves available options for the Employee ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    onbee_app,
  },
  async run({ $ }) {
    const options = await onbee_app.propDefinitions.employeeId.options.call(this.onbee_app, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
