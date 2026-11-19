import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-find-contact",
  name: "Find Contact",
  description: "Search Cavyro contacts by name, email, phone, or Telegram username and return the full matching records (up to 100)."
    + " Use it before **Create Contact** to avoid duplicates, and to find contact IDs for **Create Deal**."
    + " [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cavyro,
    query: {
      type: "string",
      label: "Query",
      description: "Text to search for (2-100 characters), e.g. an email address or `Ana Petrović`.",
    },
  },
  async run({ $ }) {
    const contacts = await this.cavyro.listContacts({
      $,
      params: {
        q: this.query,
        limit: 100,
      },
    });
    $.export("$summary", `Found ${contacts.length} contact(s) matching "${this.query}"`);
    return contacts;
  },
};
