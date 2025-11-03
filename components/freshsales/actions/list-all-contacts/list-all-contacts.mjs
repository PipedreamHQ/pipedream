import freshsales from "../../freshsales.app.mjs";

export default {
  key: "freshsales-list-all-contacts",
  name: "List All Contacts",
  description: "Fetch all contacts from your Freshsales account. [See the documentation](https://developer.freshsales.io/api/#list_all_contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshsales,
  },
  async run({ $ }) {
    const filterId = await this.freshsales.getFilterId({
      model: "contacts",
      name: "All Contacts",
    });

    const response = this.freshsales.paginate({
      fn: this.freshsales.listContacts,
      responseField: "contacts",
      filterId,
    });

    const contacts = [];
    for await (const contact of response) {
      contacts.push(contact);
    }

    $.export("$summary", `Successfully fetched ${contacts?.length || 0} contact${contacts?.length === 1
      ? ""
      : "s"}`);
    return contacts;
  },
};
