import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-search-people",
  name: "Search People",
  description: "Retrieve a collection of person objects ordered by their relevance to the user, based on communication and collaboration patterns and business relationships. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-people)",
  version: "0.0.2",
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
      description: "Search for people by name or alias (e.g., 'Jane Smith'). Supports fuzzy matching. Note: Only works for the signed-in user's relevant people.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter people using [OData syntax](https://learn.microsoft.com/en-us/azure/search/search-query-odata-syntax-reference). Limits response to people matching specified criteria. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-people)",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Changes the sort order of results. For example, `displayName` or `displayName desc`. Default ordering is by relevance to the user.",
      optional: true,
    },
    select: {
      type: "string",
      label: "Select",
      description: "Comma-separated list of [properties](https://learn.microsoft.com/en-us/graph/api/resources/person?view=graph-rest-1.0#properties) to include in the response. Recommended for performance optimization.",
      optional: true,
    },
    skip: {
      type: "integer",
      label: "Skip",
      description: "Skip the first N results. Note: Not supported with `$search`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of people to return per page",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      search,
      filter,
      orderBy,
      select,
      skip,
      maxResults,
    } = this;

    const response = await this.microsoftOutlook.listPeople({
      $,
      params: {
        "$search": search,
        "$filter": filter,
        "$orderby": orderBy,
        "$select": select,
        "$skip": skip,
        "$top": maxResults,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.value.length}\` ${response.value.length === 1
      ? "person"
      : "people"}`);

    return response;
  },
};
