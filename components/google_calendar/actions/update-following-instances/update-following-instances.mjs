import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "google_calendar-update-following-instances",
  name: "Update Following Event Instances",
  description: "Update all instances of a recurring event following a specific instance. This creates a new recurring event starting from the selected instance. [See the documentation](https://developers.google.com/calendar/api/guides/recurringevents#modifying_all_following_instances)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    recurringEventId: {
      propDefinition: [
        googleCalendar,
        "recurringEventId",
        ({ calendarId }) => ({
          calendarId,
        }),
      ],
    },
    instanceId: {
      propDefinition: [
        googleCalendar,
        "instanceId",
        ({
          calendarId,
          recurringEventId,
        }) => ({
          calendarId,
          recurringEventId,
        }),
      ],
      description: "The instance where the split will occur. All instances from this point forward will be updated with your changes, while earlier instances remain unchanged. For example, selecting the 4th instance will keep instances 1-3 as-is and update instances 4 onwards.",
    },
    summary: {
      label: "Event Title",
      type: "string",
      description: "Enter a new title for all following instances",
      optional: true,
    },
    eventStartDate: {
      label: "Event Start Date",
      type: "string",
      description: "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
      optional: true,
    },
    eventEndDate: {
      label: "Event End Date",
      type: "string",
      description: "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
      optional: true,
    },
    location: {
      label: "Event Location",
      type: "string",
      description: "Specify a new location for all following instances",
      optional: true,
    },
    description: {
      label: "Event Description",
      type: "string",
      description: "Enter a new description for all following instances",
      optional: true,
    },
    attendees: {
      label: "Attendees",
      type: "string",
      description: "Enter either an array or a comma separated list of email addresses of attendees",
      optional: true,
    },
    repeatFrequency: {
      type: "string",
      label: "New Repeat Frequency",
      description: "Optionally change the repeat frequency for following instances",
      optional: true,
      options: Object.keys(constants.REPEAT_FREQUENCIES),
      reloadProps: true,
    },
    repeatInterval: {
      type: "integer",
      label: "Repeat Interval",
      description: "Repeat interval (e.g., 1 for every day, 2 for every other day)",
      optional: true,
      hidden: true,
    },
    repeatUntil: {
      type: "string",
      label: "Repeat Until",
      description: "The event will repeat only until this date (format: yyyy-mm-dd)",
      optional: true,
      hidden: true,
    },
    repeatTimes: {
      type: "integer",
      label: "Number of Occurrences",
      description: "Limit the number of times this event will occur",
      optional: true,
      hidden: true,
    },
    colorId: {
      propDefinition: [
        googleCalendar,
        "colorId",
      ],
    },
    timeZone: {
      propDefinition: [
        googleCalendar,
        "timeZone",
      ],
    },
    sendUpdates: {
      propDefinition: [
        googleCalendar,
        "sendUpdates",
      ],
    },
  },
  async additionalProps(props) {
    if (this.repeatFrequency) {
      const frequency = constants.REPEAT_FREQUENCIES[this.repeatFrequency];
      props.repeatInterval.description = `Enter 1 to "repeat every ${frequency}", enter 2 to "repeat every other ${frequency}", etc. Defaults to 1.`;
    }
    props.repeatInterval.hidden = !this.repeatFrequency;
    props.repeatUntil.hidden = !this.repeatFrequency;
    props.repeatTimes.hidden = !this.repeatFrequency;
    return {};
  },
  methods: {
    ...createEventCommon.methods,
    calculateUntilDate(instanceStartDate) {
      // Calculate UNTIL date (one second before the instance start)
      // Format: YYYYMMDDTHHMMSSZ (UTC)
      const targetDate = new Date(instanceStartDate);
      targetDate.setSeconds(targetDate.getSeconds() - 1);

      const year = targetDate.getUTCFullYear();
      const month = String(targetDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getUTCDate()).padStart(2, "0");
      const hours = String(targetDate.getUTCHours()).padStart(2, "0");
      const minutes = String(targetDate.getUTCMinutes()).padStart(2, "0");
      const seconds = String(targetDate.getUTCSeconds()).padStart(2, "0");

      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    },
    modifyRecurrenceRule(recurrenceArray, untilDate) {
      // Modify the RRULE to add/update UNTIL parameter
      if (!recurrenceArray || !recurrenceArray.length) {
        return recurrenceArray;
      }

      return recurrenceArray.map((rule) => {
        if (!rule.startsWith("RRULE:")) {
          return rule;
        }

        // Remove existing UNTIL or COUNT if present
        let modifiedRule = rule.replace(/;UNTIL=[^;]+/g, "").replace(/;COUNT=[^;]+/g, "");

        // Add new UNTIL
        return `${modifiedRule};UNTIL=${untilDate}`;
      });
    },
  },
  async run({ $ }) {
    // Step 1: Get the original recurring event
    const originalEvent = await this.googleCalendar.getEvent({
      calendarId: this.calendarId,
      eventId: this.recurringEventId,
    });

    // Step 2: Get the target instance
    const targetInstance = await this.googleCalendar.getEvent({
      calendarId: this.calendarId,
      eventId: this.instanceId,
    });

    // Calculate UNTIL date (one second before the target instance)
    const instanceStartDate = targetInstance.start.dateTime || targetInstance.start.date;
    const untilDate = this.calculateUntilDate(instanceStartDate);

    // Step 3: Trim the original recurring event
    const trimmedRecurrence = this.modifyRecurrenceRule(
      originalEvent.recurrence,
      untilDate,
    );

    await this.googleCalendar.updateEvent({
      calendarId: this.calendarId,
      eventId: this.recurringEventId,
      sendUpdates: this.sendUpdates,
      requestBody: {
        ...originalEvent,
        recurrence: trimmedRecurrence,
      },
    });

    // Step 4: Create new recurring event with changes
    const timeZone = await this.getTimeZone(this.timeZone || targetInstance.start.timeZone);
    const attendees = this.formatAttendees(this.attendees, originalEvent.attendees);

    // Determine recurrence for new event
    let newRecurrence;
    if (this.repeatFrequency) {
      newRecurrence = this.formatRecurrence({
        repeatFrequency: this.repeatFrequency,
        repeatInterval: this.repeatInterval,
        repeatTimes: this.repeatTimes,
        repeatUntil: this.repeatUntil,
      });
    } else {
      // Use original recurrence rules
      newRecurrence = originalEvent.recurrence;
    }

    const newEvent = await this.googleCalendar.createEvent({
      calendarId: this.calendarId,
      sendUpdates: this.sendUpdates,
      resource: {
        summary: this.summary || originalEvent.summary,
        location: this.location || originalEvent.location,
        description: this.description || originalEvent.description,
        start: this.getDateParam({
          date: this.eventStartDate || instanceStartDate,
          timeZone: timeZone || targetInstance.start.timeZone,
        }),
        end: this.getDateParam({
          date: this.eventEndDate || targetInstance.end.dateTime || targetInstance.end.date,
          timeZone: timeZone || targetInstance.end.timeZone,
        }),
        recurrence: newRecurrence,
        attendees,
        colorId: this.colorId || originalEvent.colorId,
      },
    });

    $.export("$summary", `Successfully split recurring event. Original trimmed, new event created with ID: \`${newEvent.id}\``);

    return {
      originalEvent: {
        id: this.recurringEventId,
        trimmedRecurrence,
      },
      newEvent,
    };
  },
};
