import clear_books from "../../clear_books.app.mjs";

export default {
  key: "clear_books-list-supplier-id-options",
  name: "List Supplier ID Options",
  description: "Retrieves available options for the Supplier ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clear_books,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await clear_books.propDefinitions.supplierId.options.call(this.clear_books, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
