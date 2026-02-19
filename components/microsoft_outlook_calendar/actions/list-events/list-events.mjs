import { ConfigurationError } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-list-events",
  name: "List Events",
  description: "Get a list of event objects in the user's mailbox. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-events)",
  version: "0.0.11",
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
      description: "Must set to true to include recurring events in results. When true, you must also provide `Start Date Time` and `End Date Time`. Set to false to return only non-recurring events.",
      optional: true,
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "Required when `Include Recurring` is true. The start date and time of the time range in ISO 8601 format (e.g. `2019-11-08T19:00:00-08:00`).",
      optional: true,
    },
    endDateTime: {
      type: "string",
      label: "End Date Time",
      description: "Required when `Include Recurring` is true. The end date and time of the time range in ISO 8601 format (e.g. `2019-11-08T20:00:00-08:00`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      "$orderby": this.orderBy,
      "$filter": this.filter,
      "$top": this.maxResults,
    };

    const { includeRecurring } = this;
    if (includeRecurring && (!this.startDateTime || !this.endDateTime)) {
      throw new ConfigurationError("`Start Date Time` and `End Date Time` are required when `Include Recurring` is true");
    }

    const { value = [] } = !includeRecurring
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

    const events = !includeRecurring
      ? value.filter((event) => !event.recurrence)
      : value;

    $.export("$summary", `Successfully retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}`);

    return events;
  },
};
