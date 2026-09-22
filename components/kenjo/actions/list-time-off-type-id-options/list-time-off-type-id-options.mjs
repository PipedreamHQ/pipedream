import kenjo from "../../kenjo.app.mjs";

export default {
  key: "kenjo-list-time-off-type-id-options",
  name: "List Time Off Type ID Options",
  description: "Retrieves available options for the Time Off Type ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kenjo,
  },
  async run({ $ }) {
    const options = await kenjo.propDefinitions.timeOffTypeId.options.call(this.kenjo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
