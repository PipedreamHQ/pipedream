import accelo from "../../accelo.app.mjs";

export default {
  key: "accelo-list-affiliation-id-options",
  name: "List Affiliation ID Options",
  description: "Retrieves available options for the Affiliation ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accelo,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await accelo.propDefinitions.affiliationId.options
      .call(this.accelo, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
