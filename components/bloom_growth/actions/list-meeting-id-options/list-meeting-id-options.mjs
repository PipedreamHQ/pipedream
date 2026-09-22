import bloom_growth from "../../bloom_growth.app.mjs";

export default {
  key: "bloom_growth-list-meeting-id-options",
  name: "List Meeting Id Options",
  description: "Retrieves available options for the Meeting Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bloom_growth,
  },
  async run({ $ }) {
    const options = await bloom_growth.propDefinitions.meetingId.options.call(this.bloom_growth);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
