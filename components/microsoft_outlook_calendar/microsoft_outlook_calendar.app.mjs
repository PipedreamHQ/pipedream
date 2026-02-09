import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import pickBy from "lodash.pickby";

export default {
  type: "app",
  app: "microsoft_outlook_calendar",
  propDefinitions: {
    eventId: {
      label: "Event ID",
      description: "The event ID",
      type: "string",
      async options() {
        const { value: events } = await this.listCalendarEvents();

        return events.map((event) => ({
          label: event.subject,
          value: event.id,
        }));
      },
    },
    recurringEventId: {
      label: "Recurring Event ID",
      description: "The ID of the recurring event series",
      type: "string",
      async options() {
        const { value: events } = await this.listCalendarEvents();

        return events
          .filter((event) => event.recurrence)
          .map((event) => ({
            label: event.subject,
            value: event.id,
          }));
      },
    },
    instanceId: {
      label: "Instance ID",
      description: "The ID of the specific occurrence of the recurring event",
      type: "string",
      async options({
        recurringEventId, startDateTime, endDateTime,
      }) {
        if (!recurringEventId || !startDateTime || !endDateTime) {
          return [];
        }
        const { value: instances } = await this.listEventInstances({
          eventId: recurringEventId,
          params: {
            startDateTime,
            endDateTime,
          },
        });

        return instances.map((instance) => ({
          label: `${instance.subject} - ${instance.start?.dateTime}`,
          value: instance.id,
        }));
      },
    },
    contentType: {
      label: "Content Type",
      description: "Content type (default `text`)",
      type: "string",
      optional: true,
      options: [
        "text",
        "html",
      ],
      default: "text",
    },
    content: {
      label: "Content",
      description: "Content of the email in text or html format",
      type: "string",
      optional: true,
    },
    timeZone: {
      label: "Time Zone",
      description: "Time zone of the event in supported time zones, [See the docs](https://docs.microsoft.com/en-us/graph/api/outlookuser-supportedtimezones)",
      type: "string",
      async options() {
        const timeZonesResponse = await this.getSupportedTimeZones();
        return timeZonesResponse.value.map((tz) => ({
          label: tz.displayName,
          value: tz.alias,
        }));
      },
    },
    start: {
      label: "Start",
      description: "Start date-time (yyyy-MM-ddThh:mm:ss) e.g. '2022-04-15T11:20:00'",
      type: "string",
    },
    end: {
      label: "End",
      description: "End date-time (yyyy-MM-ddThh:mm:ss) e.g. '2022-04-15T13:30:00'",
      type: "string",
    },
    attendees: {
      label: "Attendees",
      description: "Array of email addresses",
      type: "string[]",
    },
    location: {
      label: "Location",
      description: "Location of the event",
      type: "string",
      optional: true,
    },
    isOnlineMeeting: {
      label: "Is Online Meeting",
      description: "If it is online meeting or not",
      type: "boolean",
      optional: true,
    },
    expand: {
      label: "Expand",
      description: "Additional properties",
      type: "object",
      optional: true,
    },
    recurrencePatternType: {
      label: "Recurrence Pattern Type",
      description: "How often the event repeats. Required when creating a recurring event. [See recurrence pattern docs](https://learn.microsoft.com/en-us/graph/api/resources/recurrencepattern)",
      type: "string",
      optional: true,
      options: [
        {
          label: "Daily",
          value: "daily",
        },
        {
          label: "Weekly",
          value: "weekly",
        },
        {
          label: "Absolute Monthly (e.g. 15th of each month)",
          value: "absoluteMonthly",
        },
        {
          label: "Relative Monthly (e.g. 2nd Tuesday)",
          value: "relativeMonthly",
        },
        {
          label: "Absolute Yearly (e.g. March 15 every year)",
          value: "absoluteYearly",
        },
        {
          label: "Relative Yearly (e.g. 2nd Thursday of November)",
          value: "relativeYearly",
        },
      ],
    },
    recurrenceInterval: {
      label: "Recurrence Interval",
      description: "Number of units between occurrences (e.g. every 2 weeks = 2). Required when recurrence pattern type is set.",
      type: "integer",
      optional: true,
      min: 1,
    },
    recurrenceDaysOfWeek: {
      label: "Recurrence Days of Week",
      description: "Days of the week the event repeats (required for weekly, relativeMonthly, relativeYearly). E.g. monday, tuesday",
      type: "string[]",
      optional: true,
      options: [
        {
          label: "Sunday",
          value: "sunday",
        },
        {
          label: "Monday",
          value: "monday",
        },
        {
          label: "Tuesday",
          value: "tuesday",
        },
        {
          label: "Wednesday",
          value: "wednesday",
        },
        {
          label: "Thursday",
          value: "thursday",
        },
        {
          label: "Friday",
          value: "friday",
        },
        {
          label: "Saturday",
          value: "saturday",
        },
      ],
    },
    recurrenceDayOfMonth: {
      label: "Recurrence Day of Month",
      description: "Day of the month (1-31). Required for absoluteMonthly and absoluteYearly.",
      type: "integer",
      optional: true,
      min: 1,
      max: 31,
    },
    recurrenceMonth: {
      label: "Recurrence Month",
      description: "Month (1-12). Required for absoluteYearly and relativeYearly.",
      type: "integer",
      optional: true,
      min: 1,
      max: 12,
    },
    recurrenceFirstDayOfWeek: {
      label: "Recurrence First Day of Week",
      description: "First day of the week for weekly recurrence. Required for weekly pattern. [See recurrence pattern](https://learn.microsoft.com/en-us/graph/api/resources/recurrencepattern)",
      type: "string",
      optional: true,
      options: [
        {
          label: "Sunday",
          value: "sunday",
        },
        {
          label: "Monday",
          value: "monday",
        },
        {
          label: "Tuesday",
          value: "tuesday",
        },
        {
          label: "Wednesday",
          value: "wednesday",
        },
        {
          label: "Thursday",
          value: "thursday",
        },
        {
          label: "Friday",
          value: "friday",
        },
        {
          label: "Saturday",
          value: "saturday",
        },
      ],
      default: "sunday",
    },
    recurrenceIndex: {
      label: "Recurrence Week Index",
      description: "Which instance in the month/year (e.g. second Tuesday). Optional for relativeMonthly and relativeYearly; defaults to first.",
      type: "string",
      optional: true,
      options: [
        {
          label: "First",
          value: "first",
        },
        {
          label: "Second",
          value: "second",
        },
        {
          label: "Third",
          value: "third",
        },
        {
          label: "Fourth",
          value: "fourth",
        },
        {
          label: "Last",
          value: "last",
        },
      ],
      default: "first",
    },
    recurrenceRangeType: {
      label: "Recurrence Range Type",
      description: "How the recurrence ends. [See recurrence range docs](https://learn.microsoft.com/en-us/graph/api/resources/recurrencerange)",
      type: "string",
      optional: true,
      options: [
        {
          label: "No end date",
          value: "noEnd",
        },
        {
          label: "End by date",
          value: "endDate",
        },
        {
          label: "End after N occurrences",
          value: "numbered",
        },
      ],
    },
    recurrenceEndDate: {
      label: "Recurrence End Date",
      description: "End date for recurrence (yyyy-MM-dd). Required when recurrence range type is endDate.",
      type: "string",
      optional: true,
    },
    recurrenceNumberOfOccurrences: {
      label: "Recurrence Number of Occurrences",
      description: "Number of occurrences. Required when recurrence range type is numbered.",
      type: "integer",
      optional: true,
      min: 1,
    },
  },
  methods: {
    client() {
      return Client.init({
        authProvider: (done) => {
          done(null, this.$auth.oauth_access_token);
        },
      });
    },
    async createHook({ data = {} } = {}) {
      return await this.client().api("/subscriptions")
        .post(data);
    },
    async renewHook({
      hookId, data = {},
    } = {}) {
      return await this.client().api(`/subscriptions/${hookId}`)
        .patch(data);
    },
    async deleteHook({ hookId } = {}) {
      return await this.client().api(`/subscriptions/${hookId}`)
        .delete();
    },
    async getSupportedTimeZones() {
      return await this.client().api("/me/outlook/supportedTimeZones")
        .get();
    },
    async createCalendarEvent({ data = {} } = {}) {
      return await this.client().api("/me/events")
        .post(data);
    },
    async updateCalendarEvent({
      eventId, data = {},
    } = {}) {
      return await this.client().api(`/me/events/${eventId}`)
        .patch(data);
    },
    async deleteCalendarEvent({ eventId } = {}) {
      return await this.client().api(`/me/events/${eventId}`)
        .delete();
    },
    async listCalendarEvents({ params = {} } = {}) {
      return await this.client().api("/me/events")
        .query(pickBy(params))
        .get();
    },
    async getCalendarEvent({
      eventId, params = {},
    } = {}) {
      return await this.client().api(`/me/events/${eventId}`)
        .query(pickBy(params))
        .get();
    },
    async listCalendarView({ params = {} } = {}) {
      return await this.client().api("/me/calendar/calendarView")
        .query(pickBy(params))
        .get();
    },
    async listEventInstances({
      eventId, params = {},
    } = {}) {
      return await this.client().api(`/me/events/${eventId}/instances`)
        .query(pickBy(params))
        .get();
    },
    async listContacts({ params = {} } = {}) {
      return await this.client().api("/me/contacts")
        .query(pickBy(params))
        .get();
    },
    async listPeople({ params = {} } = {}) {
      return await this.client().api("/me/people")
        .query(pickBy(params))
        .get();
    },
    async getSchedule({
      timeZone, data = {},
    } = {}) {
      return await this.client().api("/me/calendar/getSchedule")
        .header("Prefer", `outlook.timezone="${timeZone}"`)
        .post(data);
    },
  },
};
