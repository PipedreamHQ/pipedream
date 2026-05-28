import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-list-phone-number-id-options",
  name: "List Phone Number ID Options",
  description: "Retrieves available options for the Phone Number ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    elevenlabs,
  },
  async run({ $ }) {
    const options = await elevenlabs.propDefinitions.phoneNumberId.options.call(this.elevenlabs);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
