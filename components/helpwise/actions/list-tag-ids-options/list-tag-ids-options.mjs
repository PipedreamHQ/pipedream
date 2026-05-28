import { helpwise } from "../../helpwise.app.mjs";

export default {
  key: "helpwise-list-tag-ids-options",
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
    helpwise,
  },
  async run({ $ }) {
    const options = await helpwise.propDefinitions.tagIds.options.call(this.helpwise, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
