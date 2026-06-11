import flippingbook from "../../flippingbook.app.mjs";

export default {
  key: "flippingbook-list-flipbook-id-options",
  name: "List Flipbook ID Options",
  description: "Retrieves available options for the Flipbook ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    flippingbook,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await flippingbook.propDefinitions.flipbookId.options.call(this.flippingbook, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
