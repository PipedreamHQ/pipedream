import { ConfigurationError } from "@pipedream/platform";
import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_calendar-update-following-instances",
  name: "Update Following Event Instances",
  description: "Split a recurring event you organize so all occurrences from a selected one onward get your changes. This deletes the selected occurrence, ends the original series before it, and creates a new series starting from it that you organize, inviting the original guests (or `Attendees`, if set). Fields left empty (including `Show As`), plus the meeting link, reminders, visibility and guest permissions, are copied from the original series; guest responses are carried over where Google allows, so some guests may need to respond again. Fails without making changes if you don't organize the event: to change your own color or `Show As`, use **Update Event** for the whole series or **Update Event Instance** for one occurrence; to accept or decline, use **Respond to Event**. Returns the deleted occurrence, the trimmed series, the new event and the invited guests. [See the documentation](https://developers.google.com/calendar/api/guides/recurringevents#modifying_all_following_instances)",
  version: "0.2.0",
  ai: "optimized",
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
    transparency: {
      propDefinition: [
        googleCalendar,
        "transparency",
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
    buildAttendees(originalAttendees = []) {
      const pickWritable = (attendee) => Object.fromEntries(
        constants.WRITABLE_ATTENDEE_FIELDS
          .filter((field) => field in attendee)
          .map((field) => [
            field,
            attendee[field],
          ]),
      );
      const emails = this.parseEmails(this.attendees);
      if (!emails.length) {
        return originalAttendees
          .filter((attendee) => attendee?.email)
          .map(pickWritable);
      }
      return emails.map((email) => {
        const original = originalAttendees.find(
          (attendee) => attendee?.email?.toLowerCase() === email.toLowerCase(),
        );
        return original
          ? pickWritable(original)
          : {
            email,
          };
      });
    },
    buildCarriedFields(originalEvent) {
      const carried = {};
      for (const field of constants.SPLIT_CARRIED_EVENT_FIELDS) {
        if (field in originalEvent) {
          carried[field] = originalEvent[field];
        }
      }
      if (carried.conferenceData) {
        carried.conferenceData = {
          ...carried.conferenceData,
        };
        delete carried.conferenceData.createRequest;
      }
      return carried;
    },
    validateDateInput(label, value) {
      if (value && !utils.isValidDateInput(value)) {
        throw new ConfigurationError(`\`${label}\` must be \`yyyy-mm-dd\` or an RFC3339 date-time, got \`${value}\``);
      }
    },
    getRecurrenceCount(recurrence = []) {
      const rule = recurrence.find((r) => r.startsWith("RRULE:"));
      const match = rule?.match(/COUNT=(\d+)/);
      return match
        ? parseInt(match[1], 10)
        : 0;
    },
    async countInstancesBefore(targetInstance) {
      const getStart = (instance) => new Date(
        instance.originalStartTime?.dateTime
          || instance.originalStartTime?.date
          || instance.start.dateTime
          || instance.start.date,
      ).getTime();
      const targetStart = getStart(targetInstance);
      let count = 0;
      let pageToken;
      do {
        const {
          items = [], nextPageToken,
        } = await this.googleCalendar.listEventInstances({
          calendarId: this.calendarId,
          eventId: this.recurringEventId,
          // Cancelled occurrences still consume the original COUNT
          showDeleted: true,
          maxResults: constants.INSTANCES_MAX_RESULTS,
          pageToken,
        });
        count += items.filter((instance) => getStart(instance) < targetStart).length;
        pageToken = nextPageToken;
      } while (pageToken);
      return count;
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
    this.validateDateInput("Event Start Date", this.eventStartDate);
    this.validateDateInput("Event End Date", this.eventEndDate);

    const originalEvent = await this.googleCalendar.getEvent({
      calendarId: this.calendarId,
      eventId: this.recurringEventId,
    });

    if (!originalEvent.organizer?.self) {
      throw new Error(`No changes made: this calendar doesn't organize the recurring event${originalEvent.organizer?.email
        ? ` (organizer: ${originalEvent.organizer.email})`
        : ""}, and splitting it would decline the selected occurrence and re-invite every guest from your account. To change your own color or Show As, use **Update Event** for the whole series or **Update Event Instance** for one occurrence; to accept or decline, use **Respond to Event**.`);
    }

    const targetInstance = await this.googleCalendar.getEvent({
      calendarId: this.calendarId,
      eventId: this.instanceId,
    });

    if (targetInstance.recurringEventId !== this.recurringEventId) {
      throw new Error(`No changes made: occurrence \`${this.instanceId}\` doesn't belong to recurring event \`${this.recurringEventId}\`. Use **List Event Instances** to find an occurrence of this series.`);
    }

    if (originalEvent.recurrence?.some((rule) => rule.startsWith("RDATE"))) {
      throw new Error("No changes made: this series has extra one-off dates (RDATE) that can't be split reliably. Use **Update Event Instance** to change individual occurrences instead.");
    }

    // Prepare and validate as much as possible before the irreversible delete
    const instanceStartDate = targetInstance.start.dateTime || targetInstance.start.date;
    const untilDate = this.calculateUntilDate(instanceStartDate);
    const trimmedRecurrence = this.modifyRecurrenceRule(
      originalEvent.recurrence,
      untilDate,
    );
    const timeZone = await this.getTimeZone(this.timeZone || targetInstance.start.timeZone);

    let newRecurrence;
    if (this.repeatFrequency) {
      newRecurrence = this.formatRecurrence({
        repeatFrequency: this.repeatFrequency,
        repeatInterval: this.repeatInterval,
        repeatTimes: this.repeatTimes,
        repeatUntil: this.repeatUntil,
      });
    } else {
      // Carry over only the occurrences the original COUNT had left
      const originalCount = this.getRecurrenceCount(originalEvent.recurrence);
      const remainingCount = originalCount
        ? originalCount - await this.countInstancesBefore(targetInstance)
        : 0;
      if (originalCount && remainingCount < 1) {
        throw new Error(`No changes made: couldn't work out how many of the original ${originalCount} occurrences remain after the selected one.`);
      }
      newRecurrence = originalEvent.recurrence?.map((rule) => {
        if (!rule.startsWith("RRULE:")) {
          return rule;
        }
        const withoutCount = rule.replace(/COUNT=\d+;?/, "").replace(/;$/, "");
        return remainingCount
          ? `${withoutCount};COUNT=${remainingCount}`
          : withoutCount;
      });
    }

    const carriedFields = this.buildCarriedFields(originalEvent);
    const newEventResource = {
      ...carriedFields,
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
      attendees: this.buildAttendees(originalEvent.attendees),
      colorId: this.colorId || originalEvent.colorId,
      transparency: this.transparency || originalEvent.transparency,
    };

    // Delete before trimming: once UNTIL excludes the instance, Google rejects
    // the delete with a 400, and an undeleted exception would linger as a duplicate
    await this.googleCalendar.deleteEvent({
      calendarId: this.calendarId,
      eventId: this.instanceId,
      sendUpdates: this.sendUpdates || undefined,
    });

    // The delete is irreversible, so on failure try to restore the instance
    let step4TrimApplied = false;
    try {
      await this.googleCalendar.updateEvent({
        calendarId: this.calendarId,
        eventId: this.recurringEventId,
        sendUpdates: this.sendUpdates || undefined,
        requestBody: {
          ...originalEvent,
          recurrence: trimmedRecurrence,
        },
      });
      step4TrimApplied = true;

      const newEvent = await this.googleCalendar.createEvent({
        calendarId: this.calendarId,
        sendUpdates: this.sendUpdates || undefined,
        conferenceDataVersion: carriedFields.conferenceData
          ? constants.CONFERENCE_DATA_VERSION
          : undefined,
        resource: newEventResource,
      });

      const invitedAttendees = (newEvent.attendees || [])
        .filter((attendee) => !attendee.self)
        .map((attendee) => attendee.email);

      $.export("$summary", `Successfully split recurring event: deleted occurrence \`${this.instanceId}\`, ended the original series before it, and created new series \`${newEvent.id}\` with ${invitedAttendees.length} invited guest(s)`);

      return {
        deletedInstance: {
          id: this.instanceId,
          start: targetInstance.start,
          end: targetInstance.end,
        },
        originalEvent: {
          id: this.recurringEventId,
          trimmedRecurrence,
        },
        newEvent,
        invitedAttendees,
      };
    } catch (splitError) {
      try {
        // Restore the RRULE first: Google rejects un-cancelling an instance UNTIL excludes
        if (step4TrimApplied) {
          await this.googleCalendar.patchEvent({
            calendarId: this.calendarId,
            eventId: this.recurringEventId,
            sendUpdates: this.sendUpdates || undefined,
            requestBody: {
              recurrence: originalEvent.recurrence,
            },
          });
        }
        // Patch only the status: the delete bumped the sequence, so a full body is rejected
        await this.googleCalendar.patchEvent({
          calendarId: this.calendarId,
          eventId: this.instanceId,
          sendUpdates: this.sendUpdates || undefined,
          requestBody: {
            status: targetInstance.status || "confirmed",
          },
        });
      } catch (_restoreError) {
        $.export("$summary", `Partial failure: the split could not be completed and automatic restoration failed. Occurrence \`${this.instanceId}\` is deleted${step4TrimApplied
          ? " and the original series ends before it"
          : ""}; manual repair required.`);
        throw splitError;
      }
      $.export("$summary", `Split failed and was rolled back: the original series and occurrence \`${this.instanceId}\` were restored and no new series was created.`);
      throw splitError;
    }
  },
};
