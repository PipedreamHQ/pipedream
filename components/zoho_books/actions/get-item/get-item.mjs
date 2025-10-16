// legacy_hash_id: a_wdiVqz
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-get-item",
  name: "Get Item",
  description: "Gets the details of an existing item. [See the documentation](https://www.zoho.com/books/api/v3/items/#get-an-item)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoBooks,
    itemId: {
      propDefinition: [
        zohoBooks,
        "itemId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zohoBooks.getItem({
      $,
      itemId: this.itemId,
    });

    $.export("$summary", `Successfully fetched item with Id: ${this.itemId}`);
    return response;
  },
};
