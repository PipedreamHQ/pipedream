import { capitalize } from "../../common/utils.mjs";
import theBookie from "../../the_bookie.app.mjs";

export default {
  key: "the_bookie-find-contact",
  name: "Find Contacts",
  description: "Find a contact from the address book. [See the documentation](https://app.thebookie.nl/nl/help/article/api-documentatie/#contact_list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    theBookie,
    search: {
      type: "string",
      label: "Search",
      description: "Search by company name.",
      optional: true,
    },
    isClient: {
      type: "boolean",
      label: "Is Client",
      description: "Return only client contacts.",
      optional: true,
    },
    isSupplier: {
      type: "boolean",
      label: "Is Supplier",
      description: "Return only supplier contacts.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.theBookie.paginate({
      $,
      fn: this.theBookie.searchContact,
      params: {
        search: this.search,
        is_client: capitalize(this.isClient),
        is_supplier: capitalize(this.isSupplier),
      },
    });

    const responseArray = [];

    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Found ${responseArray.length} contact(s)`);
    return responseArray;
  },
};
