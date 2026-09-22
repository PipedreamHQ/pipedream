import help_scout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-list-tag-id-options",
  name: "List Tag ID Options",
  description: "Retrieves available options for the Tag ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    help_scout,
    page: {
      propDefinition: [
        help_scout,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await help_scout.propDefinitions.tagId.options.call(this.help_scout, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
