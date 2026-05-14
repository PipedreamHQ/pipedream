import typefully from "../../typefully.app.mjs";

export default {
  key: "typefully-list-kind-options",
  name: "List Kind Options",
  description: "Retrieves available options for the Kind field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    typefully,
  },
  async run({ $ }) {
    const options = await typefully.propDefinitions.kind.options.call(this.typefully);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
