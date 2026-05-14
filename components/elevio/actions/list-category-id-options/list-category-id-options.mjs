import elevio from "../../elevio.app.mjs";

export default {
  key: "elevio-list-category-id-options",
  name: "List Category ID Options",
  description: "Retrieves available options for the Category ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    elevio,
  },
  async run({ $ }) {
    const options = await elevio.propDefinitions.categoryId.options.call(this.elevio);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
