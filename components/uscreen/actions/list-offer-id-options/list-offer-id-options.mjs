import uscreen from "../../uscreen.app.mjs";

export default {
  key: "uscreen-list-offer-id-options",
  name: "List Product ID Options",
  description: "Retrieves available options for the Product ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    uscreen,
  },
  async run({ $ }) {
    const options = await uscreen.propDefinitions.offerId.options.call(this.uscreen);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
