import boldsign from "../../boldsign.app.mjs";

export default {
  key: "boldsign-list-brand-id-options",
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
    boldsign,
  },
  async run({ $ }) {
    const options = await boldsign.propDefinitions.brandId.options.call(this.boldsign);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
