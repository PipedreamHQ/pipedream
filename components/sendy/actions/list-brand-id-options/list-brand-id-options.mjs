import sendy from "../../sendy.app.mjs";

export default {
  key: "sendy-list-brand-id-options",
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
    sendy,
  },
  async run({ $ }) {
    const options = await sendy.propDefinitions.brandId.options.call(this.sendy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
