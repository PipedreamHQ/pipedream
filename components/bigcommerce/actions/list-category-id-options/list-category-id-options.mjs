import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  key: "bigcommerce-list-category-id-options",
  name: "List Category Id Options",
  description: "Retrieves available options for the Category Id field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bigcommerce,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await bigcommerce.propDefinitions.categoryId.options
      .call(this.bigcommerce, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
