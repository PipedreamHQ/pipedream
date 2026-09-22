import nuclino from "../../nuclino.app.mjs";

export default {
  key: "nuclino-list-object-options",
  name: "List Object Options",
  description: "Retrieves available options for the Object field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nuclino,
  },
  async run({ $ }) {
    const options = await nuclino.propDefinitions.object.options.call(this.nuclino);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
