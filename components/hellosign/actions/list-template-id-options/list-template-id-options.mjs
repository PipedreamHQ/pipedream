import hellosign from "../../hellosign.app.mjs";

export default {
  key: "hellosign-list-template-id-options",
  name: "List Template Options",
  description: "Retrieves available options for the Template field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hellosign,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await hellosign.propDefinitions.templateId.options.call(this.hellosign, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
