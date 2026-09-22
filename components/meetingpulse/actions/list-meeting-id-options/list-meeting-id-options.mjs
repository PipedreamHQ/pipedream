import meetingpulse from "../../meetingpulse.app.mjs";

export default {
  key: "meetingpulse-list-meeting-id-options",
  name: "List Meeting ID Options",
  description: "Retrieves available options for the Meeting ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    meetingpulse,
  },
  async run({ $ }) {
    const options = await meetingpulse.propDefinitions.meetingId.options.call(this.meetingpulse);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
