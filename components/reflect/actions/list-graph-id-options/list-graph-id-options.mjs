import reflect from "../../reflect.app.mjs";

export default {
  key: "reflect-list-graph-id-options",
  name: "List GraphId Options",
  description: "Retrieves available options for the GraphId field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    reflect,
  },
  async run({ $ }) {
    const options = await reflect.propDefinitions.graphId.options.call(this.reflect);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
