import sellercloud from "../../sellercloud.app.mjs";

export default {
  key: "sellercloud-list-purchaser-options",
  name: "List Purchaser Options",
  description: "Retrieves available options for the Purchaser field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sellercloud,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await sellercloud.propDefinitions.purchaser.options.call(this.sellercloud, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
