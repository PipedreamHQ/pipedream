import proabono from "../../proabono.app.mjs";

export default {
  key: "proabono-list-offer-id-options",
  name: "List Offer ID Options",
  description: "Retrieves available options for the Offer ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    proabono,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await proabono.propDefinitions.offerId.options.call(this.proabono, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
