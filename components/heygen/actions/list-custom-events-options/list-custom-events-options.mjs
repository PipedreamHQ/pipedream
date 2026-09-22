import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-list-custom-events-options",
  name: "List Custom Events Options",
  description: "Retrieves available options for the Custom Events field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    heygen,
  },
  async run({ $ }) {
    const options = await heygen.propDefinitions.customEvents.options.call(this.heygen);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
