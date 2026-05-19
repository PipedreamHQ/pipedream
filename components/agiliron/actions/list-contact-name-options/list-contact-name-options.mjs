import agiliron from "../../agiliron.app.mjs";

export default {
  key: "agiliron-list-contact-name-options",
  name: "List Contact Name Options",
  description: "Retrieves available options for the Contact Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    agiliron,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await agiliron.propDefinitions.contactName.options
      .call(this.agiliron, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
