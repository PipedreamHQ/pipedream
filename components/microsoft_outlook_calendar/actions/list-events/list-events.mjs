import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-list-events",
  name: "List Events",
  description: "Get a list of event objects in the user's mailbox. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-events)",
  version: "0.0.4",
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
    includeRecurring: {
      type: "boolean",
      label: "Include Recurring",
      description: "Whether to include recurring events",
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    if (!this.includeRecurring) {
      return {};
    }
    return {
      startDateTime: {
        type: "string",
        label: "Start Date Time",
        description: "The start date and time of the time range, represented in ISO 8601 format. For example, `2019-11-08T19:00:00-08:00`",
      },
      endDateTime: {
        type: "string",
        label: "End Date Time",
        description: "The end date and time of the time range, represented in ISO 8601 format. For example, `2019-11-08T20:00:00-08:00`",
      },
    };
  },
  async run({ $ }) {
    const params = {
      "$orderby": this.orderBy,
      "$filter": this.filter,
      "$top": this.maxResults,
    };

    const { value = [] } = !this.includeRecurring
      ? await this.microsoftOutlook.listCalendarEvents({
        $,
        params,
      })
      : await this.microsoftOutlook.listCalendarView({
        $,
        params: {
          ...params,
          startDateTime: this.startDateTime,
          endDateTime: this.endDateTime,
        },
      });

    $.export("$summary", `Successfully retrieved ${value.length} event${value.length === 1
      ? ""
      : "s"}`);

    return value;
  },
};
