import selzy from "../../selzy.app.mjs";

export default {
  key: "selzy-list-system-template-id-options",
  name: "List System Template Id Options",
  description: "Retrieves available options for the System Template Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    selzy,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await selzy.propDefinitions.systemTemplateId.options.call(this.selzy, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
