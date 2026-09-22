import everhour from "../../everhour.app.mjs";

export default {
  key: "everhour-list-tags-options",
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
    everhour,
  },
  async run({ $ }) {
    const options = await everhour.propDefinitions.tags.options.call(this.everhour);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
