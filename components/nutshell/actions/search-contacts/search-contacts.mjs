import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-search-contacts",
  name: "Search Contacts",
  description: "Search contacts by string. Returns an array of contacts with id, displayName, primaryEmail, and primaryPhone. [See the documentation](https://developers-rpc.nutshell.com/detail/class_core.html#a7b09990091f6ae57ed2c2ee951abfc7b)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    searchString: {
      type: "string",
      label: "Search String",
      description: "The string to search for (matches contact names, emails, etc.).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of contacts to return.",
      default: 1000,
      optional: true,
    },
  },
  async run({ $ }) {
    const contacts = await this.nutshell.searchContacts({
      $,
      string: this.searchString,
      limit: this.limit ?? 1000,
    });
    $.export("$summary", `Found ${contacts.length} contact(s)`);
    return contacts;
  },
};
