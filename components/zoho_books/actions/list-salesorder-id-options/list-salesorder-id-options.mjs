import zoho_books from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-list-salesorder-id-options",
  name: "List Salesorder Id Options",
  description: "Retrieves available options for the Salesorder Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_books,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zoho_books.propDefinitions.salesorderId.options.call(this.zoho_books, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
