import mumble from "../../mumble.app.mjs";

export default {
  key: "mumble-list-label-name-list-options",
  name: "List Label Name Options",
  description: "Retrieves available options for the Label Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mumble,
  },
  async run({ $ }) {
    const options = await mumble.propDefinitions.labelNameList.options.call(this.mumble);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
