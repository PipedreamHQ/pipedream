import onlinecheckwriter from "../../onlinecheckwriter.app.mjs";

export default {
  key: "onlinecheckwriter-list-payee-id-options",
  name: "List Payee ID Options",
  description: "Retrieves available options for the Payee ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    onlinecheckwriter,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await onlinecheckwriter.propDefinitions.payeeId.options
      .call(this.onlinecheckwriter, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
