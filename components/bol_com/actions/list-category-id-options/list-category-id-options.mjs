import bol_com from "../../bol_com.app.mjs";

export default {
  key: "bol_com-list-category-id-options",
  name: "List Category ID Options",
  description: "Retrieves available options for the Category ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bol_com,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await bol_com.propDefinitions.categoryId.options
      .call(this.bol_com, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
