import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-search-contacts",
  name: "Search Contacts",
  description: "Search for contacts by name from your saved contacts list and retrieve their email addresses. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-contacts)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
    search: {
      type: "string",
      label: "Search Query",
      description: "Search for contacts by name (e.g., 'John Doe'). Searches display name, given name, and surname.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter contacts by email address using [OData syntax](https://learn.microsoft.com/en-us/azure/search/search-query-odata-syntax-reference). For example, `emailAddresses/any(a:a/address eq 'john@example.com')`. Note: $filter only works with the `address` sub-property of `emailAddresses`. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-contacts)",
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Comma-separated list of relationships to expand and include in the response. See the [relationships table of the contact](https://learn.microsoft.com/en-us/graph/api/resources/contact?view=graph-rest-1.0#relationships) object for supported names.",
      optional: true,
    },
    select: {
      type: "string",
      label: "Select",
      description: "Comma-separated list of [properties](https://learn.microsoft.com/en-us/graph/api/resources/contact?view=graph-rest-1.0#properties) to include in the response.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of contacts to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      search,
      filter,
      expand,
      select,
      maxResults,
    } = this;

    const response = await this.microsoftOutlook.listContacts({
      $,
      params: {
        "$top": maxResults,
        "$filter": filter,
        "$search": search,
        "$expand": expand,
        "$select": select,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.value.length}\` contact(s)`);

    return response;
  },
};
