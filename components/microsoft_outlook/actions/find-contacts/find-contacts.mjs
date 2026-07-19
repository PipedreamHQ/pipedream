import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import { COUNT_QUERY_PARAM } from "../../common/constants.mjs";

export default {
  key: "microsoft_outlook-find-contacts",
  name: "Find Contacts",
  description:
    "Search and list contacts in the authenticated user's Outlook contacts."
    + " Returns `{ count, contacts }` where `count` is the Graph-reported total contact count (`@odata.count`) and `contacts` is the filtered result array."
    + " Omit `searchString` to return all contacts up to `maxResults`."
    + " When `searchString` is provided, filters contacts by displayName, givenName, surname, or email address (case-sensitive substring match)."
    + " **Important:** `maxResults` now bounds how many contacts are fetched from Graph before filtering — contacts beyond that window will not be searched."
    + " Example: `find-contacts(searchString=\"George Costanza\", maxResults=200)` → scans the first 200 contacts and returns matches."
    + " Example: `find-contacts(searchString=\"george@vandelay.com\")` → matches by email address."
    + " Use the returned contact `id` with **Save Contact** to update the contact."
    + " [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-list-contacts)",
  version: "1.0.0",
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
      description: "Optional case-sensitive substring to match against displayName, givenName, surname, or email address. Omit to return all contacts up to `maxResults`.",
      type: "string",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
      description: "Maximum number of contacts to fetch from Graph before applying the client-side filter. Contacts beyond this window will not be searched.",
    },
  },
  async run({ $ }) {
    const meta = {};
    const contacts = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listContacts,
      args: {
        params: {
          $count: COUNT_QUERY_PARAM,
        },
      },
      max: this.maxResults,
      meta,
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
      }
    }

    const count = meta["@odata.count"] ?? results.length;
    $.export("$summary", `Found ${results.length} matching contact${results.length !== 1
      ? "s"
      : ""} (${count} total in collection).`);
    return {
      count,
      contacts: results,
    };
  },
};
