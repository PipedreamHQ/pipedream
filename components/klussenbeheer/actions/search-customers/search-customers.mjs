import klussenbeheer from "../../klussenbeheer.app.mjs";

export default {
  key: "klussenbeheer-search-customers",
  name: "Search Customers",
  description: "Search customers by name, email address or phone number. Returns up to 10 matching customers. [See the documentation](https://samdesk.nl/klussenbeheer/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    klussenbeheer,
    searchTerm: {
      propDefinition: [
        klussenbeheer,
        "searchTerm",
      ],
      description: "Search in customer name, email address and phone number.",
    },
  },
  async run({ $ }) {
    const customers = await this.klussenbeheer.searchCustomers($, this.searchTerm);

    $.export("$summary", `Found ${customers.length} customer${customers.length === 1
      ? ""
      : "s"}`);

    return customers;
  },
};
