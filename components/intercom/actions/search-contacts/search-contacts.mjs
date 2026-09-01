// x-pd-ai: optimized
import {
  CONTACTS_SEARCH_DEFAULT_PER_PAGE,
  CONTACTS_SEARCH_MAX_PER_PAGE,
} from "../../common/constants.mjs";
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-search-contacts",
  name: "Search Contacts",
  description: "Search Intercom contacts by a query string (POST /contacts/search). Returns a bounded page of matching contacts, each including `id`, `email`, and `external_id` so you can copy the appropriate value into **Reply To Conversation**'s Intercom User ID, Email, or User ID prop. If `pages.next.starting_after` is present in the response, call this action again with that cursor in **Starting After** to retrieve the next page. Pass **Fields** (e.g. `[\"id\", \"email\", \"external_id\"]`) to limit each returned contact to only those keys. Example: set **Query** to `acme` to find all contacts whose email contains `acme`. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/contacts/searchcontacts).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    intercom,
    query: {
      type: "string",
      label: "Query",
      description: "The value to search for. Matched against the contact `name` or `email` field (whichever contains the value) using the `~` (contains) operator (e.g. `jane.doe@example.com` or `Jane Doe`).",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of contacts to return in a single bounded page (min 1, max ${CONTACTS_SEARCH_MAX_PER_PAGE}). Defaults to ${CONTACTS_SEARCH_DEFAULT_PER_PAGE}.`,
      min: 1,
      max: CONTACTS_SEARCH_MAX_PER_PAGE,
      default: CONTACTS_SEARCH_DEFAULT_PER_PAGE,
      optional: true,
    },
    startingAfter: {
      type: "string",
      label: "Starting After",
      description: "Pagination cursor from a prior call's `pages.next.starting_after` value. Omit to start from the first page.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "When provided, each returned contact object is limited to only these field names (e.g. `[\"id\", \"email\", \"external_id\"]`). Omit to return the full contact object.",
      optional: true,
    },
  },
  async run({ $ }) {
    const perPage = this.maxResults ?? CONTACTS_SEARCH_DEFAULT_PER_PAGE;

    const response = await this.intercom.searchContact({
      $,
      data: {
        query: {
          operator: "OR",
          value: [
            {
              field: "name",
              operator: "~",
              value: this.query,
            },
            {
              field: "email",
              operator: "~",
              value: this.query,
            },
          ],
        },
        pagination: {
          per_page: perPage,
          starting_after: this.startingAfter,
        },
      },
    });

    const contacts = response?.data ?? [];

    const result = this.fields?.length
      ? {
        ...response,
        data: contacts.map((contact) =>
          Object.fromEntries(this.fields.map((f) => [
            f,
            contact[f],
          ]))),
      }
      : response;

    $.export("$summary", `Found ${contacts.length} contact${contacts.length === 1
      ? ""
      : "s"} matching "${this.query}"`);
    return result;
  },
};
