import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-find-contacts",
  name: "Find Contacts",
  description:
    "Search and list contacts in the authenticated user's Outlook contacts."
    + " Omit `searchString` to return all contacts up to `maxResults`."
    + " When `searchString` is provided, filters contacts by displayName, givenName, surname, or email address (case-sensitive substring match)."
    + " Example: `find-contacts(searchString=\"George Costanza\")` → returns contact record with `displayName`, `id`, `emailAddresses`, `businessPhones`."
    + " Example: `find-contacts(searchString=\"george@vandelay.com\")` → matches by email address."
    + " Use the returned contact `id` with **Save Contact** to update the contact."
    + " [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-list-contacts)",
  version: "0.1.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
    searchString: {
      label: "Search String",
      description: "Optional substring to match against displayName, givenName, surname, or email address. Case-sensitive. Omit to return all contacts.",
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
    const contacts = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listContacts,
      args: {},
    });

    const results = [];
    for await (const contact of contacts) {
      const matches = !this.searchString
        || contact?.displayName?.includes(this.searchString)
        || contact?.givenName?.includes(this.searchString)
        || contact?.surname?.includes(this.searchString)
        || contact?.emailAddresses?.find(
          (e) => e?.address === this.searchString || e?.name?.includes(this.searchString),
        );
      if (matches) {
        results.push(contact);
        if (this.maxResults && results.length >= this.maxResults) break;
      }
    }

    $.export("$summary", `Found ${results.length} contact${results.length !== 1
      ? "s"
      : ""}`);
    return results;
  },
};
