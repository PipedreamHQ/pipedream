import vapi from "../../vapi.app.mjs";

export default {
  key: "vapi-list-phone-number-id-options",
  name: "List Phone Number ID Options",
  description: "Retrieves available options for the Phone Number ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vapi,
  },
  async run({ $ }) {
    const options = await vapi.propDefinitions.phoneNumberId.options.call(this.vapi);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
