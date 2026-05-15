import starloop from "../../starloop.app.mjs";

export default {
  key: "starloop-list-business-id-options",
  name: "List Business ID Options",
  description: "Retrieves available options for the Business ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    starloop,
  },
  async run({ $ }) {
    const options = await starloop.propDefinitions.businessId.options.call(this.starloop);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
