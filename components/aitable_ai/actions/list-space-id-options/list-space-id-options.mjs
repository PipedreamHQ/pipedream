import aitable_ai from "../../aitable_ai.app.mjs";

export default {
  key: "aitable_ai-list-space-id-options",
  name: "List Space ID Options",
  description: "Retrieves available options for the Space ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aitable_ai,
  },
  async run({ $ }) {
    const options = await aitable_ai.propDefinitions.spaceId.options.call(this.aitable_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
