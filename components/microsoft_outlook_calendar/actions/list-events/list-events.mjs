import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-list-events",
  name: "List Events",
  description: "Get a list of event objects in the user's mailbox. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-events)",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftOutlook,
    filter: {
      type: "string",
      label: "Filter",
      description: "Use the `$filter` query parameter to filter events. E.g. `contains(subject, 'my event')` [See the documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for more information about the `$filter` parameter.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "The field to sort the results by. Default is `createdDateTime`. [See the documentation](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#orderby-parameter) for more info about the `$orderby` parameter.",
      default: "createdDateTime",
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Whether to sort the results in ascending or descending order. Default is `descending`.",
      options: [
        {
          label: "ascending",
          value: "asc",
        },
        {
          label: "descending",
          value: "desc",
        },
      ],
      default: "desc",
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
        "$orderby": `${this.orderBy} ${this.sortOrder}`,
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
