import klenty from "../../klenty.app.mjs";

export default {
  key: "klenty-list-cadence-name-options",
  name: "List Cadence Options",
  description: "Retrieves available options for the Cadence field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    klenty,
  },
  async run({ $ }) {
    const options = await klenty.propDefinitions.cadenceName.options.call(this.klenty);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
