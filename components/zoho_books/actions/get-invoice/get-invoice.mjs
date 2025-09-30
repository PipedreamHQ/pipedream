// legacy_hash_id: a_Mdie64
import { PRINT_OPTIONS } from "../../common/constants.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-get-invoice",
  name: "Get Invoice",
  description: "Gets the details of an invoice. [See the documentation](https://www.zoho.com/books/api/v3/invoices/#get-an-invoice)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoBooks,
    invoiceId: {
      propDefinition: [
        zohoBooks,
        "invoiceId",
      ],
      description: "ID of the invoice to get details.",
    },
    print: {
      type: "string",
      label: "Print",
      description: "Print the exported pdf.",
      options: PRINT_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zohoBooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
      params: {
        print: this.print,
        accept: "json",
      },
    });

    $.export("$summary", `Successfully fetched invoice with Id: ${this.invoiceId}`);
    return response;
  },
};
