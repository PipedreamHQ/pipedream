import craftmypdf from "../../craftmypdf.app.mjs";

export default {
  key: "craftmypdf-list-template-id-options",
  name: "List Template Id Options",
  description: "Retrieves available options for the Template Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    craftmypdf,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await craftmypdf.propDefinitions.templateId.options.call(this.craftmypdf, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
