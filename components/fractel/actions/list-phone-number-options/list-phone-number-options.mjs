import fractel from "../../fractel.app.mjs";

export default {
  key: "fractel-list-phone-number-options",
  name: "List Phone Number Options",
  description: "Retrieves available options for the Phone Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fractel,
  },
  async run({ $ }) {
    const options = await fractel.propDefinitions.phoneNumber.options.call(this.fractel);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
