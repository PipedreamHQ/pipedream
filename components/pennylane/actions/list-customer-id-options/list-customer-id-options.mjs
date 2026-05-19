import pennylane from "../../pennylane.app.mjs";

export default {
  key: "pennylane-list-customer-id-options",
  name: "List Customer Id Options",
  description: "Retrieves available options for the Customer Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pennylane,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await pennylane.propDefinitions.customerId.options.call(this.pennylane, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
