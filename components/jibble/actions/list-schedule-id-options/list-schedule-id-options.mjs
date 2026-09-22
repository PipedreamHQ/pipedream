import jibble from "../../jibble.app.mjs";

export default {
  key: "jibble-list-schedule-id-options",
  name: "List Schedule ID Options",
  description: "Retrieves available options for the Schedule ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jibble,
  },
  async run({ $ }) {
    const options = await jibble.propDefinitions.scheduleId.options.call(this.jibble);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
