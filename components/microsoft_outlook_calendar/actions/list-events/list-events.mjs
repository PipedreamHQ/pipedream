import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-list-events",
  name: "List Events",
  description: "Get a list of event objects in the user's mailbox. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-events)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    filter: {
      type: "string",
      label: "Filter",
      description: "Filters results. For example, `contains(subject, 'meet for lunch?')` will include events whose title contains ‘meet for lunch?’. [See documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for the full list of operations.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Orders results. For example, `displayName desc` will sort the results by Display Name in decending order.",
      default: "createdDateTime desc",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const { value = [] } = await this.microsoftOutlook.listCalendarEvents({
      $,
      params: {
        "$orderby": this.orderBy,
        "$filter": this.filter,
        "$top": this.maxResults,
      },
    });

    $.export("$summary", `Successfully retrieved ${value.length} event${value.length === 1
      ? ""
      : "s"}`);

    return value;
  },
};
