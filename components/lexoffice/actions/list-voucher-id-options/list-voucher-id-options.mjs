import lexoffice from "../../lexoffice.app.mjs";

export default {
  key: "lexoffice-list-voucher-id-options",
  name: "List Voucher ID Options",
  description: "Retrieves available options for the Voucher ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lexoffice,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await lexoffice.propDefinitions.voucherId.options.call(this.lexoffice, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
