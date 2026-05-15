import dpd2 from "../../dpd2.app.mjs";

export default {
  key: "dpd2-list-storefront-id-options",
  name: "List Storefront ID Options",
  description: "Retrieves available options for the Storefront ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dpd2,
  },
  async run({ $ }) {
    const options = await dpd2.propDefinitions.storefrontId.options.call(this.dpd2);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
