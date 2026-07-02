import dealmachine from "../../dealmachine.app.mjs";

export default {
  key: "dealmachine-list-tag-ids-options",
  name: "List Tag IDs Options",
  description: "Retrieves available options for the Tag IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dealmachine,
  },
  async run({ $ }) {
    const options = await dealmachine.propDefinitions.tagIds.options.call(this.dealmachine, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
