import square from "../../square.app.mjs";

export default {
  key: "square-list-location-options",
  name: "List Location Options",
  description: "Retrieves available options for the Location field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    square,
  },
  async run({ $ }) {
    const options = await square.propDefinitions.location.options.call(this.square);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
