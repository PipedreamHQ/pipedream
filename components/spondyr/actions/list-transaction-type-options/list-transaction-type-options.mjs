import spondyr from "../../spondyr.app.mjs";

export default {
  key: "spondyr-list-transaction-type-options",
  name: "List Transaction Type Options",
  description: "Retrieves available options for the Transaction Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    spondyr,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await spondyr.propDefinitions.transactionType.options.call(this.spondyr, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
