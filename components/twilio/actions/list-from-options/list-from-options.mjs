import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-list-from-options",
  name: "List From Options",
  description: "Retrieves available options for the From field.",
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
    const options = await twilio.propDefinitions.from.options.call(this.twilio);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
