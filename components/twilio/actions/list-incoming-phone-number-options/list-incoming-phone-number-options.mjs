import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-list-incoming-phone-number-options",
  name: "List Incoming Phone Number Options",
  description: "Retrieves available options for the Incoming Phone Number field.",
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
    const options = await twilio.propDefinitions.incomingPhoneNumber.options.call(this.twilio);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
