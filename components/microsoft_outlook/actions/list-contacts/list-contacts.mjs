import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-list-contacts",
  version: "0.0.23",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "List Contacts",
  description: "Get a contact collection from the default contacts folder, [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-list-contacts)",
  props: {
    microsoftOutlook,
    filterAddress: {
      label: "Email Address",
      description: "If this is given, only contacts with the given address will be retrieved.",
      type: "string",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const items = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listContacts,
      args: {
        $,
        filterAddress: this.filterAddress,
      },
      max: this.maxResults,
    });

    const contacts = [];
    for await (const item of items) {
      contacts.push(item);
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${contacts.length} contact${contacts.length != 1 ? "s" : ""} retrieved.`);
    return contacts;
  },
};
