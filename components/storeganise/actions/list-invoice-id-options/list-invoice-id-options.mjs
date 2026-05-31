import storeganise from "../../storeganise.app.mjs";

export default {
  key: "storeganise-list-invoice-id-options",
  name: "List Invoice ID Options",
  description: "Retrieves available options for the Invoice ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    storeganise,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await storeganise.propDefinitions.invoiceId.options.call(this.storeganise, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
