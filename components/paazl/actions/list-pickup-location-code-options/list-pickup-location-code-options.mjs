import paazl from "../../paazl.app.mjs";

export default {
  key: "paazl-list-pickup-location-code-options",
  name: "List Pickup Location Code Options",
  description: "Retrieves available options for the Pickup Location Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paazl,
  },
  async run({ $ }) {
    const options = await paazl.propDefinitions.pickupLocationCode.options.call(this.paazl);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
