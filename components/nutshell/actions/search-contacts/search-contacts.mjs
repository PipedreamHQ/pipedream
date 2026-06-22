import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-search-contacts",
  name: "Search Contacts",
  description: "Search contacts (people) in Nutshell. Returns records in the existing contact output format. [See the documentation](https://developers.nutshell.com/reference/cde301caba6b033521a71e6bed772a58)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    query: {
      propDefinition: [
        nutshell,
        "query",
      ],
    },
    limit: {
      propDefinition: [
        nutshell,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      ...(this.query
        ? {
          q: this.query,
        }
        : {}),
      ...(this.limit
        ? {
          "page[limit]": this.limit,
        }
        : {}),
    };
    const contacts = await this.nutshell.listContacts({
      $,
      params,
    });

    $.export("$summary", `Found ${contacts.length} contact(s)`);
    return contacts.map((c) => this.nutshell.formatContact(c));
  },
};
