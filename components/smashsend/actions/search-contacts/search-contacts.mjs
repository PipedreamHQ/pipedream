import smashsend from "../../smashsend.app.mjs";

export default {
  key: "smashsend-search-contacts",
  name: "Search Contacts",
  description: "Search for contacts by email address. [See the documentation](https://smashsend.com/docs/api/contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    smashsend,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to search for",
    },
  },
  async run({ $ }) {
    const { contact } = await this.smashsend.searchContacts({
      $,
      params: {
        email: this.email,
      },
    });
    if (contact?.id) {
      $.export("$summary", `Successfully fetched contact ${contact.id}`);
    }
    return contact;
  },
};
