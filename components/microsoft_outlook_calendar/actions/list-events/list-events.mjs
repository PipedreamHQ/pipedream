import { ConfigurationError } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

const PAGE_SIZE = 100;

export default {
  key: "microsoft_outlook_calendar-list-events",
  name: "List Events",
  description: "Get a list of event objects in the user's mailbox. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-events)",
  version: "0.0.12",
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
      description: "Filters results using OData syntax. For example, `contains(subject, 'meet for lunch?')` will include events whose title contains 'meet for lunch?'. [See documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for the full list of operations. Note: filtering on the `recurrence` property is not supported by the API.",
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
      description: "When `true`, uses the calendar view endpoint which expands each occurrence of a recurring event into its own individual result. Requires `Start Date Time` and `End Date Time`. When `false` or unset, the events endpoint is used instead, which returns recurring series as a single master entry — these are excluded from the results. `Start Date Time` and `End Date Time` can still be used to filter by date range.",
      optional: true,
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "Filter events that start at or after this date and time, in ISO 8601 format (e.g. `2019-11-08T19:00:00-08:00`). Required when `Include Recurring` is `true`. When `Include Recurring` is `false` or unset, this adds a `start/dateTime ge` filter to the events endpoint.",
      optional: true,
    },
    endDateTime: {
      type: "string",
      label: "End Date Time",
      description: "Filter events that end at or before this date and time, in ISO 8601 format (e.g. `2019-11-08T20:00:00-08:00`). Required when `Include Recurring` is `true`. When `Include Recurring` is `false` or unset, this adds an `end/dateTime le` filter to the events endpoint.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      includeRecurring, startDateTime, endDateTime, maxResults,
    } = this;

    if (includeRecurring && (!startDateTime || !endDateTime)) {
      throw new ConfigurationError("`Start Date Time` and `End Date Time` are required when `Include Recurring` is true");
    }

    if (includeRecurring) {
      const params = {
        "$orderby": this.orderBy,
        "$filter": this.filter,
        "$top": maxResults,
        startDateTime,
        endDateTime,
      };
      const { value = [] } = await this.microsoftOutlook.listCalendarView({
        $,
        params,
      });
      $.export("$summary", `Successfully retrieved ${value.length} event${value.length === 1
        ? ""
        : "s"}`);
      return value;
    }

    const filterParts = [];
    if (this.filter) filterParts.push(this.filter);
    if (startDateTime) filterParts.push(`start/dateTime ge '${startDateTime}'`);
    if (endDateTime) filterParts.push(`end/dateTime le '${endDateTime}'`);

    const params = {
      "$orderby": this.orderBy,
      "$filter": filterParts.length
        ? filterParts.join(" and ")
        : undefined,
      "$top": PAGE_SIZE,
    };

    const events = [];
    let nextLink = null;

    do {
      const response = nextLink
        ? await this.microsoftOutlook.listCalendarEventsPage({
          $,
          url: nextLink,
        })
        : await this.microsoftOutlook.listCalendarEvents({
          $,
          params,
        });

      for (const event of (response.value ?? [])) {
        if (!event.recurrence) {
          events.push(event);
          if (maxResults && events.length >= maxResults) break;
        }
      }

      nextLink = (maxResults && events.length >= maxResults)
        ? null
        : response["@odata.nextLink"];
    } while (nextLink);

    $.export("$summary", `Successfully retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}`);

    return events;
  },
};
