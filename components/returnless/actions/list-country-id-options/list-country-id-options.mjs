import returnless from "../../returnless.app.mjs";

export default {
  key: "returnless-list-country-id-options",
  name: "List Country ID Options",
  description: "Retrieves available options for the Country ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    returnless,
  },
  async run({ $ }) {
    const options = await returnless.propDefinitions.countryId.options.call(this.returnless);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
