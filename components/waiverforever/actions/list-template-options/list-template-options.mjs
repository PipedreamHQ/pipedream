import waiverforever from "../../waiverforever.app.mjs";

export default {
  key: "waiverforever-list-template-options",
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
    waiverforever,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await waiverforever.propDefinitions.template.options.call(this.waiverforever, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
