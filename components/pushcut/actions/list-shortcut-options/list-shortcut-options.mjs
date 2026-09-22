import pushcut from "../../pushcut.app.mjs";

export default {
  key: "pushcut-list-shortcut-options",
  name: "List Shortcut Options",
  description: "Retrieves available options for the Shortcut field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pushcut,
  },
  async run({ $ }) {
    const options = await pushcut.propDefinitions.shortcut.options.call(this.pushcut, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
