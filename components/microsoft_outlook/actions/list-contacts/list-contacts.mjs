import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import { COUNT_QUERY_PARAM } from "../../common/constants.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-list-contacts",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "List Contacts",
  description: "Get a contact collection from the default contacts folder. Returns `{ count, contacts }` where `count` is the true total number of contacts in the collection as reported by Microsoft Graph (`@odata.count`), and `contacts` is the array of retrieved contact records (up to `maxResults`). [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-list-contacts)",
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
      description: "Maximum number of contacts to return.",
    },
  },
  async run({ $ }) {
    const meta = {};
    const items = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listContacts,
      args: {
        $,
        filterAddress: this.filterAddress,
        params: {
          $count: COUNT_QUERY_PARAM,
        },
      },
      max: this.maxResults,
      meta,
    });

    const contacts = [];
    for await (const item of items) {
      contacts.push(item);
    }

    const count = meta["@odata.count"] ?? contacts.length;
    $.export("$summary", `Found ${count} total contacts (returned ${contacts.length}).`);
    return {
      count,
      contacts,
    };
  },
};
