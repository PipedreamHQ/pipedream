import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-list-parent-call-sid-options",
  name: "List Parent Call SID Options",
  description: "Retrieves available options for the Parent Call SID field.",
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
    const options = await twilio.propDefinitions.parentCallSid.options.call(this.twilio);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
