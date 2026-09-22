import rhombus from "../../rhombus.app.mjs";

export default {
  key: "rhombus-list-door-uuid-options",
  name: "List Access Controlled Door ID Options",
  description: "Retrieves available options for the Access Controlled Door ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rhombus,
  },
  async run({ $ }) {
    const options = await rhombus.propDefinitions.doorUuid.options.call(this.rhombus);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
