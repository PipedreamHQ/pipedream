import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-list-recording-i-d-options",
  name: "List Recording ID Options",
  description: "Retrieves available options for the Recording ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    twilio,
  },
  async run({ $ }) {
    const options = await twilio.propDefinitions.recordingID.options.call(this.twilio);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
