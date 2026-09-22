import timeular from "../../timeular.app.mjs";

export default {
  key: "timeular-list-space-id-options",
  name: "List Space Id Options",
  description: "Retrieves available options for the Space Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    timeular,
  },
  async run({ $ }) {
    const options = await timeular.propDefinitions.spaceId.options.call(this.timeular);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
