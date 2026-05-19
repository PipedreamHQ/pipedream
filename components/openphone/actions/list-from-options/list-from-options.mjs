import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-list-from-options",
  name: "List From Options",
  description: "Retrieves available options for the From field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    openphone,
  },
  async run({ $ }) {
    const options = await openphone.propDefinitions.from.options.call(this.openphone);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
