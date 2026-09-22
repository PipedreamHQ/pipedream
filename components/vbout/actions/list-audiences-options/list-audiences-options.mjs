import vbout from "../../vbout.app.mjs";

export default {
  key: "vbout-list-audiences-options",
  name: "List Audiences Options",
  description: "Retrieves available options for the Audiences field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vbout,
  },
  async run({ $ }) {
    const options = await vbout.propDefinitions.audiences.options.call(this.vbout);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
