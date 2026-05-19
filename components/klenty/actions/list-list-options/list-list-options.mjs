import klenty from "../../klenty.app.mjs";

export default {
  key: "klenty-list-list-options",
  name: "List List Options",
  description: "Retrieves available options for the List field.",
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
    const options = await klenty.propDefinitions.list.options.call(this.klenty);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
