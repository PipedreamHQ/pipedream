import tremendous from "../../tremendous.app.mjs";

export default {
  key: "tremendous-list-products-options",
  name: "List Products Options",
  description: "Retrieves available options for the Products field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tremendous,
  },
  async run({ $ }) {
    const options = await tremendous.propDefinitions.products.options.call(this.tremendous);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
