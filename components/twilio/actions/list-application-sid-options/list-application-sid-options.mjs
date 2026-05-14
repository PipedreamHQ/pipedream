import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-list-application-sid-options",
  name: "List Application SID Options",
  description: "Retrieves available options for the Application SID field.",
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
    const options = await twilio.propDefinitions.applicationSid.options.call(this.twilio);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
