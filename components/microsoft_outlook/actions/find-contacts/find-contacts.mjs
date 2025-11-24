import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-find-contacts",
  version: "0.0.21",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Find Contacts",
  description: "Finds contacts with the given search string. [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-list-contacts)",
  props: {
    microsoftOutlook,
    searchString: {
      label: "Search string",
      description: "Provide email address, given name, surname or display name (case sensitive)",
      type: "string",
    },
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const contacts = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listContacts,
      args: {
        $,
      },
    });

    const relatedContacts = [];
    for await (const contact of contacts) {
      if (
        contact?.displayName?.includes(this.searchString) ||
        contact?.givenName?.includes(this.searchString) ||
        contact?.surname?.includes(this.searchString) ||
        contact?.emailAddresses?.find(
          (e) => e?.address == this.searchString || e?.name?.includes(this.searchString),
        )
      ) {
        relatedContacts.push(contact);
        if (this.maxResults && relatedContacts.length >= this.maxResults) {
          break;
        }
      }
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${relatedContacts.length} matching contact${relatedContacts.length != 1 ? "s" : ""} found`);
    return relatedContacts;
  },
};
