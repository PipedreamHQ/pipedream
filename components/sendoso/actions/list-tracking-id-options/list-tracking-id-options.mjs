import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-tracking-id-options",
  name: "List Tracking Id Options",
  description: "Retrieves available options for the Tracking Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sendoso,
  },
  async run({ $ }) {
    const options = await sendoso.propDefinitions.trackingId.options.call(this.sendoso);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
