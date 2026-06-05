import onedesk from "../../onedesk.app.mjs";

export default {
  key: "onedesk-list-item-type-options",
  name: "List Item Type Options",
  description: "Retrieves available options for the Item Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    onedesk,
  },
  async run({ $ }) {
    const options = await onedesk.propDefinitions.itemType.options.call(this.onedesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
