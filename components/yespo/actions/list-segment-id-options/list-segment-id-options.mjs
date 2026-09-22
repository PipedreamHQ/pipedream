import yespo from "../../yespo.app.mjs";

export default {
  key: "yespo-list-segment-id-options",
  name: "List Segment Id Options",
  description: "Retrieves available options for the Segment Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    yespo,
  },
  async run({ $ }) {
    const options = await yespo.propDefinitions.segmentId.options.call(this.yespo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
