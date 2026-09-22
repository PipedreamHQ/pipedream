import pulsetic from "../../pulsetic.app.mjs";

export default {
  key: "pulsetic-list-monitor-id-options",
  name: "List Monitor ID Options",
  description: "Retrieves available options for the Monitor ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pulsetic,
  },
  async run({ $ }) {
    const options = await pulsetic.propDefinitions.monitorId.options.call(this.pulsetic);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
