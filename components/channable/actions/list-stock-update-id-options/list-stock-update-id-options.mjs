import channable from "../../channable.app.mjs";

export default {
  key: "channable-list-stock-update-id-options",
  name: "List Stock Update ID Options",
  description: "Retrieves available options for the Stock Update ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    channable,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await channable.propDefinitions.stockUpdateId.options.call(this.channable, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
