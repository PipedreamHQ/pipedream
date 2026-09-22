import lucca from "../../lucca.app.mjs";

export default {
  key: "lucca-list-legal-entity-id-options",
  name: "List Legal Entity ID Options",
  description: "Retrieves available options for the Legal Entity ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lucca,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await lucca.propDefinitions.legalEntityId.options.call(this.lucca, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
