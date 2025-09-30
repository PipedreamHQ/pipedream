// legacy_hash_id: a_Lgiern
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-delete-contact",
  name: "Delete Contact",
  description: "Deletes an existing contact. [See the documentation](https://www.zoho.com/books/api/v3/contacts/#delete-a-contact)",
  version: "0.3.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoBooks,
    customerId: {
      propDefinition: [
        zohoBooks,
        "customerId",
      ],
      description: "The Id of the contact which will be deleted.",
    },
  },
  async run({ $ }) {
    const response = await this.zohoBooks.deleteContact({
      $,
      customerId: this.customerId,
    });

    $.export("$summary", `Contact successfully deleted with Id: ${this.customerId}`);
    return response;
  },
};
