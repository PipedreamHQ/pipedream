import trust from "../../trust.app.mjs";

export default {
  key: "trust-list-brand-id-options",
  name: "List Brand ID Options",
  description: "Retrieves available options for the Brand ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trust,
  },
  async run({ $ }) {
    const options = await trust.propDefinitions.brandId.options.call(this.trust);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
