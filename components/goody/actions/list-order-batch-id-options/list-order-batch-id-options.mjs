import goody from "../../goody.app.mjs";

export default {
  key: "goody-list-order-batch-id-options",
  name: "List Order Batch Options",
  description: "Retrieves available options for the Order Batch field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    goody,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await goody.propDefinitions.orderBatchId.options.call(this.goody, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
