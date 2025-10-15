// legacy_hash_id: a_RAiV28
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-list-contacts",
  name: "List Contacts",
  description: "Lists all contacts given the organization_id. [See the documentation](https://www.zoho.com/books/api/v3/contacts/#list-contacts)",
  version: "0.5.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoBooks,
  },
  async run({ $ }) {
    const response = this.zohoBooks.paginate({
      fn: this.zohoBooks.listContacts,
      fieldName: "contacts",
    });

    const responseArray = [];
    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully fetched ${responseArray.length} item(s)`);
    return responseArray;
  },
};
