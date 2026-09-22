import shortcut from "../../shortcut.app.mjs";

export default {
  key: "shortcut-list-label-ids-options",
  name: "List Label IDs Options",
  description: "Retrieves available options for the Label IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shortcut,
  },
  async run({ $ }) {
    const options = await shortcut.propDefinitions.labelIds.options.call(this.shortcut);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
