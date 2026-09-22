import specific from "../../specific.app.mjs";

export default {
  key: "specific-list-contact-email-options",
  name: "List Contact Email Options",
  description: "Retrieves available options for the Contact Email field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    specific,
  },
  async run({ $ }) {
    const options = await specific.propDefinitions.contactEmail.options.call(this.specific);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
