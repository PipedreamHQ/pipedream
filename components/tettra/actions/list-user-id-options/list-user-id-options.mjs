import tettra from "../../tettra.app.mjs";

export default {
  key: "tettra-list-user-id-options",
  name: "List User ID Options",
  description: "Retrieves available options for the User ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tettra,
  },
  async run({ $ }) {
    const options = await tettra.propDefinitions.userId.options.call(this.tettra);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
